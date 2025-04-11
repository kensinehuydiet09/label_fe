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
        <Route path="/" element={
          currentUser ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <LandingPage />
        } />
        
        <Route path="/auth/*" element={
          currentUser ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <AuthPage />
        } />
        
        <Route path="/dashboard/*" element={
          currentUser ? <PrivateRoutes /> : <Navigate to="/auth/login" />
        } />

        <Route path="/admin/*" element={
          isAdmin ? <AdminRoutes /> : <Navigate to="/dashboard" />
        } />
        
        <Route path="/*" element={
          currentUser ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> : <Navigate to="/" />
        } />
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };