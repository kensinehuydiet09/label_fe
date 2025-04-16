import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiService } from "@/services/api";
import Constants from "@/constants";
import { toast } from "sonner";
import { EditUserDialog } from "@/components/user/EditUserDialog";

import StatsCards from "./components/StatsCards";
import UserTable from "./components/UserTable";
import SearchAndFilter from "./components/SearchAndFilter";
import Pagination from "./components/Pagination";

const ManagerUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  });
  const [pageSize, setPageSize] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchUsers = async (page = 1, limit = pageSize) => {
    setLoading(true);
    try {
      const response = await apiService.get(
        `${Constants.API_ENDPOINTS.ADMIN_GET_USERS}?page=${page}&limit=${limit}`
      );

      if (response.success) {
        setUsers(response.data.users);
        setPagination({
          totalItems: response.data.totalItems,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          itemsPerPage: response.data.itemsPerPage,
        });
      } else {
        setUsers([]);
        console.error("Failed to fetch users:", response.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, pageSize);
  }, [pageSize]);

  useEffect(() => {
    // Filter users based on search query, role filter, and status filter
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "All") {
      filtered = filtered.filter(
        (user) => user.role === roleFilter.toLowerCase()
      );
    }

    if (statusFilter !== "All") {
      const isActive = statusFilter === "Active";
      filtered = filtered.filter((user) => user.isActive === isActive);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      toast({
        title: "Success",
        description: `User ${selectedUser.username} would be deleted (API call simulated).`,
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting user.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleUserUpdated = () => {
    fetchUsers(pagination.currentPage, pageSize);
  };

  return (
    <Layout>
      <div className="container space-y-4 p-4 md:space-y-6 mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              User Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor user accounts
            </p>
          </div>

          <Button className="w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <StatsCards users={users} pagination={pagination} />

        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <UserTable
          users={filteredUsers}
          loading={loading}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />

        <Pagination
          pagination={pagination}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <EditUserDialog
        open={editDialogOpen}
        userId={selectedUser?.id}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedUser(null);
        }}
        onUserUpdated={handleUserUpdated}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{selectedUser?.username}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ManagerUser;
