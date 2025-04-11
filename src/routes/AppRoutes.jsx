import { useAuth } from "@/auth/AuthContext";
import { AuthPage } from "@/auth/AuthPage";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import AdminRoutes from "./AdminRoutes";
import Constants from "@/constants";
import LandingPage from "@/page/landing/LandingPage";

const BASE_URL = Constants.BASE_URL;

const AppRoutes = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser && currentUser.role === Constants.ROLES.ADMIN;
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page luôn hiển thị nếu đi vào route / mà chưa đăng nhập */}
        <Route path="/" element={
          currentUser ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <LandingPage />
        } />
        
        {/* Routes phân quyền cho authentication */}
        <Route path="/auth/*" element={
          currentUser ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <AuthPage />
        } />
        
        {/* Dashboard cho cả user thường và admin */}
        <Route path="/dashboard/*" element={
          currentUser ? <PrivateRoutes allowAdmin={true} /> : <Navigate to="/auth/login" />
        } />

        {/* Admin routes chỉ dành cho admin */}
        <Route path="/admin/*" element={
          isAdmin ? <AdminRoutes /> : 
          (currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />)
        } />
        
        {/* Fallback cho các routes không hợp lệ */}
        <Route path="*" element={
          currentUser ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <Navigate to="/" />
        } />
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };