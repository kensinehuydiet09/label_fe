import Dashboard from "@/page/dashboard/Dashboard";
import Projects from "@/page/projects/Projects";
import Profile from "@/page/profile/Profile";
import Deposit from "@/page/deposit/Deposit";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import Constants from "@/constants";

const PrivateRoutes = ({ allowAdmin = false }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser && currentUser.role === Constants.ROLES.ADMIN;

  // Nếu là admin và không cho phép admin truy cập, chuyển hướng tới trang admin
  if (isAdmin && !allowAdmin) {
    return <Navigate to="/admin" />;
  }

  // Các routes cho user thường (và admin nếu allowAdmin = true)
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="projects/*" element={<Projects />} />
      <Route path="profile/*" element={<Profile />} />
      <Route path="deposit/*" element={<Deposit />} />
      {/* Chuyển hướng tất cả đường dẫn không hợp lệ về dashboard user */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default PrivateRoutes;