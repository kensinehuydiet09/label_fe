import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL || '/';

const AppRoutes = () => {
  const { currentUser } = useAuth();
  console.log("🚀 ~ AppRoutes ~ currentUser:", currentUser)

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />

          {currentUser ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="auth/*" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };