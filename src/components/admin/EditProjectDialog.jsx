import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  FileSpreadsheet,
  Save,
  X,
  Eye,
  Pencil
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { apiService } from '@/services/api';
import Constants from '@/constants';

export const EditProjectDialog = ({ 
  open, 
  projectId, 
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    status: '',
    notes: ''
  });

  useEffect(() => {
    if (open && projectId) {
      fetchProjectDetails(projectId);
    }
  }, [open, projectId]);

  const fetchProjectDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await apiService.get(`${Constants.API_ENDPOINTS.ADMIN_GET_PROJECT_BY_ID}/${id}`);
      
      if (response.success) {
        setProjectData(response.data);
        setFormData({
          projectName: response.data.projectName || '',
          status: response.data.status || 'pending',
          notes: response.data.notes || ''
        });
      } else {
        console.error("Failed to fetch project details:", response.message);
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async () => {
    // In a real implementation, you would save the changes here
    // Since we're focusing on the UI, we'll just close the dialog
    onClose();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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
            <span>Project Details</span>
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
                    <Pencil className="h-4 w-4  mr-1" />
                    Edit Mode
                  </>
                )}
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            View or edit project information
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </div>
        ) : projectData ? (
          <div className="space-y-4">
            {/* View Mode */}
            {!isEditMode && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Project ID</Label>
                    <p className="font-medium">{projectData.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <p>
                      <Badge className={getStatusColor(projectData.status)}>
                        {projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1)}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Project Name</Label>
                  <p className="font-medium">{projectData.projectName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Created At</Label>
                    <p className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      {formatDate(projectData.createdAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Processed At</Label>
                    <p className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      {formatDate(projectData.processedAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Orders</Label>
                    <p className="font-medium">{projectData.totalOrders}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Cost</Label>
                    <p className="font-medium">${parseFloat(projectData.totalCost).toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">File Name</Label>
                  <p className="flex items-center">
                    <FileSpreadsheet className="mr-1 h-4 w-4 text-muted-foreground" />
                    {projectData.fileName}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Notes</Label>
                  <p className="text-sm p-2 bg-gray-50 rounded-md min-h-20">
                    {projectData.notes || "No notes added."}
                  </p>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {isEditMode && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input 
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            No project data found or an error occurred.
          </div>
        )}

        <DialogFooter>
          {isEditMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditMode(false)}
              >
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
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};