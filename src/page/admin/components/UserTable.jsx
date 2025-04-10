import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import formatMonthYear from '@/helper/formatMonthYear';

const UserTable = ({ users, loading, onEditUser, onDeleteUser }) => {
  const getRoleBadgeColor = (role) => {
    switch(role.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'user': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span>{user.username}</span>
                          <Badge className="mt-1 w-fit sm:hidden">
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatMonthYear(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {/* Desktop actions */}
                          <div className="hidden sm:flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEditUser(user)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteUser(user)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Mobile actions */}
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[30vh]">
                              <SheetHeader>
                                <SheetTitle>Actions for {user.username}</SheetTitle>
                              </SheetHeader>
                              <div className="mt-4 space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => onEditUser(user)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit User
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  onClick={() => onDeleteUser(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </Button>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTable; 