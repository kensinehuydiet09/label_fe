import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
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

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);
      
      const results = await register(email, password, username);

      if(results.success) {
        navigate("/dashboard");
      } else {
        setError(results.message || "Registration failed. Please try again.");
      }

    } catch (err) {
      console.error("Registration failed:", err);
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Invalid registration data. Please check your information.");
            break;
          case 409:
            setError("Email or username already exists. Please use different credentials.");
            break;
          default:
            setError("Registration failed. Please try again later.");
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
      title="Create a Label Vaults Account" 
      subtitle="Enter your information to get started"
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
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 py-5 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                  placeholder="johndoe"
                  required
                  disabled={loading}
                />
              </div>
            </div>

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
                  className="pl-10 py-5 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                  placeholder="name@company.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-5 pr-10 border-gray-300 bg-gray-50 focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
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
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters and include one uppercase letter, number, and special character.
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <span className="text-orange-600 hover:text-orange-700 cursor-pointer">Terms</span> and <span className="text-orange-600 hover:text-orange-700 cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 text-center border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/auth/login")}
                className="text-purple-700 hover:text-purple-900 font-medium cursor-pointer"
              >
                Sign in
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Register;
