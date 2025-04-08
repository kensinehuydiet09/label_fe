// AuthPage.jsx
import Login from '@/page/auth/Login'
import Register from '@/page/auth/Register'
import { Route, Routes, Navigate } from 'react-router-dom'

const AuthPage = () => (
  <Routes>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="/" element={<Navigate to="/auth/login" />} />
    <Route path="*" element={<Navigate to="/auth/login" />} />
  </Routes>
)

export { AuthPage }