// src/contexts/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";
import {
  decodeToken,
  isTokenExpired,
  getTokenRemainingTime,
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

  // Lưu token vào localStorage và decode nó khi state thay đổi
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      // Decode token để lấy thông tin
      const decoded = decodeToken(accessToken);
      setTokenData(decoded);

      // Kiểm tra xem token có hết hạn chưa
      if (isTokenExpired(accessToken)) {
        // Nếu token đã hết hạn và có refresh token, thử refresh
        if (refreshToken) {
          refreshAccessToken();
        } else {
          // Nếu không có refresh token, logout
          handleLogout();
        }
      } else {
        // Nếu token còn hạn, set up timer để tự động refresh trước khi hết hạn
        const remainingTime = getTokenRemainingTime(accessToken);
        if (remainingTime > 0) {
          // Refresh token khi còn 30 giây nữa là hết hạn
          const refreshTime = Math.max(remainingTime - 30, 0) * 1000;
          const refreshTimer = setTimeout(() => {
            refreshAccessToken();
          }, refreshTime);

          return () => clearTimeout(refreshTimer);
        }
      }
    } else {
      localStorage.removeItem("access_token");
      setTokenData(null);
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    } else {
      localStorage.removeItem("refresh_token");
    }
  }, [refreshToken]);

  // Kiểm tra user khi component mount
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (accessToken) {
          // Nếu token hợp lệ, lấy thông tin user từ token
          const decoded = decodeToken(accessToken);

          if (decoded) {
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
              const response = await api.get(
                Constants.API_ENDPOINTS.USER_PROFILE
              );
              // Merge thông tin từ API với thông tin từ token
              setCurrentUser((prev) => ({
                ...prev,
                ...response.data,
              }));
            } catch (error) {
              console.log("Couldn't fetch additional user data", error);
              // Không cần reject promise ở đây vì đã có thông tin cơ bản từ token
            }
          } else {
            // Token không hợp lệ
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [accessToken]);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const { data } = await api.post(Constants.API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      if (data.success === false) {
        throw new Error("No access token received from server");
      }
      setAccessToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);

      // Decode token để lấy thông tin user
      const decoded = decodeToken(data.data.accessToken);
      setTokenData(decoded);

      // Cài đặt user từ token hoặc từ
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
      throw error;
    }
  };

  // Đăng ký
  const register = async (email, password, name) => {
    try {
      const {data} = await api.post(Constants.API_ENDPOINTS.REGISTER, {
        email,
        password,
        name,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Đăng xuất
  const handleLogout = useCallback(async () => {
    try {
      // Nếu có access token, thử gọi API logout
      if (accessToken) {
        await api.post("/auth/logout").catch(() => {
          // Ignore API errors during logout
        });
      }
    } finally {
      // Xóa token và user state
      setCurrentUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setTokenData(null);
    }
  }, [accessToken]);

  // Rename để tránh conflict với hàm callback
  const logout = handleLogout;

  // Refresh token
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await api.post(Constants.API_ENDPOINTS.REFRESH_TOKEN, {
        refreshToken,
      });
      setAccessToken(response.data.accessToken);

      // Tùy API, có thể server trả về refreshToken mới
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken);
      }

      return response.data.accessToken;
    } catch (error) {
      // Logout nếu refresh token không hợp lệ
      handleLogout();
      throw error;
    }
  };

  // Kiểm tra user có quyền nhất định không (helper function)
  const hasPermission = (permission) => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions.includes(permission);
  };

  // Kiểm tra user có role nhất định không (helper function)
  const hasRole = (role) => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role.includes(role);
  };

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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
