import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

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

      console.log("🚀 ~ handleSubmit ~ results:", results);
      if(results.success) {
        navigate("/dashboard");
      }else{
        setError(results.message || "Registration failed. Please try again.");
      }

    } catch (err) {
      console.error("Registration failed:", err);
      
      // Xử lý lỗi từ API và hiển thị thông báo phù hợp
      if (err.response) {
        // Lỗi từ server với response
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
        // Không nhận được response
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        // Lỗi khởi tạo request
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow mt-52 flex justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">LV</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Label Vaults
            </h2>
            <p className="mt-2 text-gray-600">
              Sign up to continue to Label Vaults
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Error message display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Username field */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password field */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-500"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  loading 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/auth/login")}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Log In
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
