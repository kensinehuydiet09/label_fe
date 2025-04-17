import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Save,
  X,
  Eye,
  Pencil,
  Mail,
  User,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { apiService } from "@/services/api";
import Constants from "@/constants";
import { toast } from "sonner";

export const EditUserDialog = ({ open, userId, onClose, onUserUpdated }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    isActive: true,
    balance: 0,
  });

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails(userId);
    }
  }, [open, userId]);

  const fetchUserDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await apiService.get(
        `${Constants.API_ENDPOINTS.ADMIN_GET_USER_BY_ID}/${id}`
      );
      console.log("🚀 ~ fetchUserDetails ~ response:", response)

      if (response.success) {
        setUserData(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          isActive: response.data.isActive,
          balance: response.data.balance,
        });
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      toast.error("Error loading user details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      isActive: value === "active",
    }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await apiService.put(
        `${Constants.API_ENDPOINTS.ADMIN_UPDATE_USER}/${userId}`,
        formData
      );

      if (response.success) {
        toast.success("User updated successfully");
        onUserUpdated();
        onClose();
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Error updating user");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>User Details</span>
            <div className="flex gap-2 mt-5">
              <Button
                variant={isEditMode ? "outline" : "default"}
                size="sm"
                onClick={toggleEditMode}
                disabled={isLoading}
              >
                {isEditMode ? (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit Mode
                  </>
                )}
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>View or edit user information</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </div>
        ) : userData ? (
          <div className="space-y-4">
            {/* View Mode */}
            {!isEditMode && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      User ID
                    </Label>
                    <p className="font-medium">{userData.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Status
                    </Label>
                    <Badge
                      className={
                        userData.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {userData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label className="text-sm text-muted-foreground">
                      Username
                    </Label>
                  </div>
                  <p className="font-medium">{userData.username}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label className="text-sm text-muted-foreground">
                      Email
                    </Label>
                  </div>
                  <p className="font-medium">{userData.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Created At
                    </Label>
                    <p className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      {formatDate(userData.createdAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Updated At
                    </Label>
                    <p className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      {formatDate(userData.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label className="text-sm text-muted-foreground">
                      Balance
                    </Label>
                  </div>
                  <p className="font-medium">
                    ${parseFloat(userData.balance).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {isEditMode && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    disabled
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    disabled
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Label htmlFor="balance">Balance</Label>
                    <Input
                      id="balance"
                      name="balance"
                      type="number"
                      value={formData.balance}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.isActive ? "active" : "inactive"}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            No user data found or an error occurred.
          </div>
        )}

        <DialogFooter>
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
