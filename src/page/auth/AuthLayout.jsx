import React from "react";
import { Link } from "react-router-dom";

// Reusable layout for authentication pages
const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with FedEx-inspired logo */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            {/* FedEx-inspired logo */}
            <div className="flex items-center">
              <span className="text-purple-700 font-bold text-2xl tracking-tight">Label</span>
              <span className="text-orange-600 font-bold text-2xl tracking-tight">Vaults</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Page Title */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">{subtitle}</p>
          </div>

          {/* Content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Label Vaults. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
