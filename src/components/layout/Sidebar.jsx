import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  UserCircle,
  Wallet,
} from "lucide-react";

const menuItems = [
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

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="h-full w-full bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <span className="text-lg font-semibold">Menu</span>
      </div>
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
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
    </div>
  );
};

export default Sidebar; 