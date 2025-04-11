import Dashboard from '@/page/admin/Dashboard';
import ManagerProject from '@/page/admin/ManagerProject';
import ManagerUser from '@/page/admin/ManagerUser';
import Notification from '@/page/admin/Notification';
import Priceing from '@/page/admin/Priceing';
import Setting from '@/page/admin/Setting';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from "@/auth/AuthContext";
import Constants from "@/constants";

const AdminRoutes = () => {
    const { currentUser } = useAuth();
    const isAdmin = currentUser && currentUser.role === Constants.ROLES.ADMIN;

    // Kiểm tra lại một lần nữa để đảm bảo chỉ admin mới được phép vào
    if (!isAdmin) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <Routes>
          {/* Dashboard là trang mặc định cho admin */}
          <Route path="/" element={<Dashboard />} />
          <Route path="projects/*" element={<ManagerProject />} />
          <Route path="users/*" element={<ManagerUser />} />
          <Route path="settings/*" element={<Setting />} />
          <Route path="notification/*" element={<Notification />} />
          <Route path="pricing/*" element={<Priceing />} />
          {/* Redirect các đường dẫn không hợp lệ về dashboard admin */}
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
    );
};

export default AdminRoutes;