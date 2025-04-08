// AppRoutes.jsx
import { useAuth } from "@/auth/AuthContext";
import { AuthPage } from "@/auth/AuthPage";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Constants from "@/constants";

const BASE_URL = Constants.BASE_URL;

const AppRoutes = () => {
  const { currentUser } = useAuth();
  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={
          currentUser ? <Navigate to="/dashboard" /> : <AuthPage />
        } />
        
        <Route path="/*" element={
          currentUser ? <PrivateRoutes /> : <Navigate to="/auth/login" />
        } />
        
        <Route path="/" element={
          currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };