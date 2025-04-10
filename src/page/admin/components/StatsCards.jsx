import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, UserCog } from "lucide-react";

const StatsCards = ({ users, pagination }) => {
  const userStats = {
    total: pagination.totalItems || 0,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length
  };

  const stats = [
    {
      title: "Total Users",
      value: userStats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Users",
      value: userStats.active,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Inactive Users",
      value: userStats.inactive,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Admins",
      value: userStats.admins,
      icon: UserCog,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={stat.color}>{stat.value}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.title === "Total Users" ? "Total registered users" :
                 stat.title === "Active Users" ? "Currently active" :
                 stat.title === "Inactive Users" ? "Currently inactive" :
                 "Administrative users"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards; 