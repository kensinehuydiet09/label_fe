import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import AuthLayout from "./AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const results = await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Incorrect email or password. Please try again.");
            break;
          case 403:
            setError("Your account is locked. Please contact support.");
            break;
          case 404:
            setError("Account not found. Please check your email.");
            break;
          default:
            setError("Login failed. Please try again later.");
        }
      } else if (err.request) {
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout 
      title="Sign In to Label Vaults" 
      subtitle="Enter your credentials to access your account"
    >
      <Card className="border border-gray-200 shadow-lg">
        <CardContent className="pt-6 px-6 pb-8">
          {error && (
            <Alert variant="destructive" className="mb-6 text-sm bg-red-50 border border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-5 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  placeholder="name@company.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <span
                  className="text-sm text-purple-700 hover:text-purple-900 cursor-pointer font-medium"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-5 pr-10 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-purple-700 hover:bg-purple-800 text-white font-medium"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/auth/register")}
                className="text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
              >
                Create an account
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Login;
