import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  UserCircle,
  Wallet,
  Settings,
  Bell,
  DollarSign,
  Users,
} from "lucide-react";
import { useAuth } from '@/auth/AuthContext';
import Constants from '@/constants';

const userMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Manage Projects",
    icon: FolderKanban,
    path: "/projects",
  },
  {
    title: "Profile",
    icon: UserCircle,
    path: "/profile",
  },
  {
    title: "Deposit",
    icon: Wallet,
    path: "/deposit",
  },
];

const adminMenuItems = [
  {
    title: "Admin Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Manage Projects",
    icon: FolderKanban,
    path: "/admin/projects",
  },
  {
    title: "Manage Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/admin/notification",
  },
  {
    title: "Pricing",
    icon: DollarSign,
    path: "/admin/pricing",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isAdmin = currentUser && currentUser.role === Constants.ROLES.ADMIN;

  return (
    <div className="h-full w-full bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <span className="text-lg font-semibold">Menu</span>
      </div>
      
      {/* User Menu - Always visible */}
      <nav className="space-y-1 p-4">
        {userMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      
      {/* Admin Menu - Only visible for admins */}
      {isAdmin && (
        <>
          <div className="flex h-12 items-center border-t border-b px-4 mt-2">
            <span className="text-md font-semibold text-primary">Admin Panel</span>
          </div>
          <nav className="space-y-1 p-4">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path !== "/" && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
};

export default Sidebar;
