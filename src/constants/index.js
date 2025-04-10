const Constants = {
  BASE_URL: import.meta.env.VITE_BASE_URL,
  API_KEY: import.meta.env.VITE_API_KEY,

  API_ENDPOINTS: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH_TOKEN: "/auth/refresh-token",
    USER_PROFILE: "/user/profile",
    UPLOAD_FILE: "/user/upload",
    CREATE_PROJECT : "/user/shipments",
    USER_GET_PROJECT : "/user/shipments",
    USER_GET_PROJECT_BY_ID : "/user/shipment",

    ADMIN_GET_USERS: "/admin/users",
    ADMIN_GET_USER_BY_ID: "/admin/user",
    ADMIN_UPDATE_USER: "/admin/user",
    ADMIN_DELETE_USER: "/admin/user",
    ADMIN_CREATE_USER: "/admin/user",

    ADMIN_GET_SETTINGS: "/admin/settings",
    ADMIN_GET_SETTING_BY_ID: "/admin/setting",
    ADMIN_UPDATE_SETTING: "/admin/setting",
    ADMIN_DELETE_SETTING: "/admin/setting",
    ADMIN_CREATE_SETTING: "/admin/setting",
    

    PRODUCTS: "/products",
  },

  ROLES: {
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest",
  },
};

export default Constants;
