const Constants = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  API_KEY: import.meta.env.VITE_API_KEY,

  API_ENDPOINTS: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    USER_PROFILE: "/user/profile",
    REFRESH_TOKEN: "/auth/refresh-token",
    PRODUCTS: "/products",
  },

  ROLES: {
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest",
  },
};

export default Constants;
