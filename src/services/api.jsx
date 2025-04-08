// src/services/api.js
import axios from 'axios';
import { isTokenExpired, decodeToken } from '../utils/jwtUtils';

const BASE_URL = import.meta.env.VITE_API_URL;

// Function để lấy token từ localStorage
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Function để lưu token vào localStorage
const saveTokens = (accessToken, refreshToken = null) => {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }
  
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

// Khởi tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global là access token đang được refresh hay không
let isRefreshing = false;
// Danh sách các requests đang chờ refresh token
let refreshSubscribers = [];

// Function để thêm các requests vào queue chờ token mới
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Function để thực thi các requests trong queue sau khi có token mới
const onTokenRefreshed = (accessToken) => {
  refreshSubscribers.forEach(callback => callback(accessToken));
  refreshSubscribers = [];
};

// Function để refresh token
const refreshAuthToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    // Lưu tokens mới
    saveTokens(accessToken, newRefreshToken || refreshToken);
    
    // Báo cho các requests đang chờ biết token đã được refresh
    onTokenRefreshed(accessToken);
    
    return accessToken;
  } catch (error) {
    // Xóa tokens nếu refresh thất bại
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Redirect về trang login
    window.location.href = '/login';
    
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};

// Interceptor để xử lý token trong request
api.interceptors.request.use(
  async (config) => {
    // Lấy token từ localStorage
    let token = getAccessToken();
    
    // Kiểm tra token có hợp lệ không
    if (token) {
      // Kiểm tra xem token đã hết hạn chưa
      if (isTokenExpired(token)) {
        // Nếu chưa có request nào đang refresh token
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            // Thực hiện refresh token
            token = await refreshAuthToken();
          } catch (error) {
            return Promise.reject(error);
          }
        } else {
          // Nếu đã có request đang refresh token, thêm request hiện tại vào queue
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(config);
            });
          });
        }
      }
      
      // Thêm token vào header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý refresh token khi token hết hạn
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Nếu chưa có request nào đang refresh token
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Thực hiện refresh token
          const newToken = await refreshAuthToken();
          
          // Cập nhật token trong header và thử lại request ban đầu
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      } else {
        // Nếu đã có request đang refresh token, thêm request hiện tại vào queue
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axios(originalRequest));
          });
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Các hàm helper để tái sử dụng
export const apiService = {
  get: async (endpoint, params = {}, options = {}) => {
    try {
      const response = await api.get(endpoint, { params, ...options });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  post: async (endpoint, data = {}, options = {}) => {
    try {
      const response = await api.post(endpoint, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  postFormData: async (endpoint, data = {}, options = {}) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...options,
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  put: async (endpoint, data = {}, options = {}) => {
    try {
      const response = await api.put(endpoint, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  patch: async (endpoint, data = {}, options = {}) => {
    try {
      const response = await api.patch(endpoint, data, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (endpoint, options = {}) => {
    try {
      const response = await api.delete(endpoint, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Helper function để lấy thông tin từ token
  getUserInfoFromToken: () => {
    const token = getAccessToken();
    if (!token) return null;
    
    return decodeToken(token);
  }
};

// Export instance axios để sử dụng trực tiếp nếu cần
export default api;
