// PrivateRoutes.jsx
import Dashboard from "@/page/dashboard/Dashboard";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import { useAuth } from "@/auth/AuthContext";
import Constants from "@/constants";

const PrivateRoutes = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser && currentUser.role === Constants.ROLES.ADMIN;

  return (
    <Routes>
      <Route path="auth/*" element={<Navigate to="/dashboard" />} />
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="admin/*" element={
        isAdmin ? <AdminRoutes /> : <Navigate to="/dashboard" />
      } />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default PrivateRoutes;