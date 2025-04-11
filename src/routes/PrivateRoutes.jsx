import Dashboard from "@/page/dashboard/Dashboard";
import Projects from "@/page/projects/Projects";
import Profile from "@/page/profile/Profile";
import Deposit from "@/page/deposit/Deposit";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import Constants from "@/constants";

const PrivateRoutes = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser && currentUser.role === Constants.ROLES.ADMIN;

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="projects/*" element={<Projects />} />
      <Route path="profile/*" element={<Profile />} />
      <Route path="deposit/*" element={<Deposit />} />
      {/* Redirect tất cả path không hợp lệ về dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default PrivateRoutes;