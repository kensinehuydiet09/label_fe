// src/contexts/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import api, { apiService } from "../services/api";
import {
  decodeToken,
  isTokenExpired,
  getTokenRemainingTime,
  getClaimFromToken,
} from "../utils/jwtUtils";
import Constants from "@/constants";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token")
  );
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState(null);
  
  // Sử dụng useRef để lưu trữ refresh timer
  const refreshTimerRef = useRef(null);

  // Cleanup function để clear timer khi component unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, []);

  // Đăng xuất
  const handleLogout = useCallback(() => {
    // Clear any existing refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    // Xóa token và user state
    setCurrentUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setTokenData(null);
    
    // Xóa dữ liệu khỏi localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    console.log("Logout successful");
  }, []);

  // Rename để tránh conflict với hàm callback
  const logout = handleLogout;

  // Refresh token function
  const refreshAccessToken = useCallback(async () => {
    console.log("Refreshing access token...");
    try {
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiService.post(Constants.API_ENDPOINTS.REFRESH_TOKEN, {
        refreshToken,
      });
      console.log("🚀 ~ refreshAccessToken ~ response:", response)

      if (!response.data.accessToken) {
        throw new Error("No access token received from server");
      }
      
      console.log("Token refreshed successfully");
      setAccessToken(response.data.accessToken);

      // Tùy API, có thể server trả về refreshToken mới
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken);
      }

      return response.data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // Logout nếu refresh token không hợp lệ
      handleLogout();
      throw error;
    }
  }, [refreshToken, handleLogout]);

  // Setup refresh timer
  const setupRefreshTimer = useCallback(() => {
    // Clear any existing timer first
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!accessToken) return;

    // Nếu token còn hạn, set up timer để tự động refresh trước khi hết hạn
    const remainingTime = getTokenRemainingTime(accessToken);
    console.log(`Token expires in ${remainingTime} seconds`);
    
    // Nếu còn ít hơn 10 giây, refresh ngay lập tức
    if (remainingTime <= 10) {
      console.log("Token expiring very soon, refreshing immediately");
      refreshAccessToken().catch(err => {
        console.error("Immediate refresh failed:", err);
      });
      return;
    }
    
    // Refresh token khi còn 30 giây nữa là hết hạn
    const refreshTime = Math.max(remainingTime - 30, 0) * 1000;
    console.log(`Will refresh token in ${refreshTime/1000} seconds`);
    
    refreshTimerRef.current = setTimeout(() => {
      console.log("Timer triggered, refreshing token now");
      refreshAccessToken().catch(err => {
        console.error("Timer-triggered refresh failed:", err);
      });
    }, refreshTime);
  }, [accessToken, refreshAccessToken]);

  // Handle local storage for access token
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      
      try {
        // Decode token để lấy thông tin
        const decoded = decodeToken(accessToken);
        setTokenData(decoded);
        
        if (isTokenExpired(accessToken)) {
          console.log("Token is expired, attempting to refresh");
          if (refreshToken) {
            refreshAccessToken();
          } else {
            handleLogout();
          }
        } else {
          // Setup timer for token refresh
          setupRefreshTimer();
        }
      } catch (error) {
        console.error("Error processing access token:", error);
        handleLogout();
      }
    } else {
      localStorage.removeItem("access_token");
      setTokenData(null);
    }
  }, [accessToken, refreshToken, refreshAccessToken, setupRefreshTimer, handleLogout]);

  // Handle local storage for refresh token
  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    } else {
      localStorage.removeItem("refresh_token");
    }
  }, [refreshToken]);

  // Load user data from token and optionally from API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!accessToken) {
          setLoading(false);
          return;
        }

        // Nếu token hợp lệ, lấy thông tin user từ token
        const decoded = decodeToken(accessToken);

        if (!decoded) {
          console.log("Could not decode token");
          handleLogout();
          return;
        }

        // Tạo user object từ decoded token
        const userData = {
          id: decoded.sub || decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role || [],
          permissions: decoded.permissions || [],
        };

        setCurrentUser(userData);

        // Tuỳ chọn: Gọi API để validate token và lấy thêm thông tin chi tiết
        try {
          const response = await api.get(Constants.API_ENDPOINTS.USER_PROFILE);
          // Merge thông tin từ API với thông tin từ token
          setCurrentUser((prev) => ({
            ...prev,
            ...response.data,
          }));
        } catch (error) {
          console.log("Couldn't fetch additional user data", error);
          // Không cần reject promise ở đây vì đã có thông tin cơ bản từ token
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [accessToken, handleLogout]);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const { data } = await api.post(Constants.API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      
      if (data.success === false) {
        throw new Error("Login failed");
      }
      
      if (!data.data?.accessToken) {
        throw new Error("No access token received from server");
      }
      
      setAccessToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);

      // Decode token để lấy thông tin user
      const decoded = decodeToken(data.data.accessToken);

      // Cài đặt user từ response hoặc từ token
      if (data.user) {
        setCurrentUser(data.user);
      } else if (decoded) {
        setCurrentUser({
          id: decoded.sub || decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role || [],
          permissions: decoded.permissions || [],
        });
      }

      return decoded;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Đăng ký
  const register = async (email, password, name) => {
    try {
      const { data } = await api.post(Constants.API_ENDPOINTS.REGISTER, {
        email,
        password,
        name,
      });
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Kiểm tra user có quyền nhất định không (helper function)
  const hasPermission = useCallback((permission) => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions.includes(permission);
  }, [currentUser]);

  // Kiểm tra user có role nhất định không (helper function)
  const hasRole = useCallback((role) => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role.includes(role);
  }, [currentUser]);

  const value = {
    currentUser,
    accessToken,
    refreshToken,
    tokenData,
    login,
    register,
    logout,
    refreshAccessToken,
    hasPermission,
    hasRole,
    isAuthenticated: !!currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export jwtUtils for completeness
export { decodeToken, isTokenExpired, getTokenRemainingTime, getClaimFromToken };
