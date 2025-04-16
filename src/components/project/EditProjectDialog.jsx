import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  DollarSign,
  Package,
  Clock,
  FileText,
  FileChartColumn,
  Loader2,
} from "lucide-react";
import { apiService } from "@/services/api";
import Constants from "@/constants";
import { format } from "date-fns";

export const EditProjectDialog = ({ open, projectId, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "",
    notes: "",
    status: "pending",
  });
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (open && projectId) {
      fetchProjectDetails(projectId);
    } else {
      setIsLoading(false);
    }
  }, [open, projectId]);

  const fetchProjectDetails = async (id) => {
    setIsLoading(true);
    try {
      const result = await apiService.get(
        `${Constants.API_ENDPOINTS.USER_GET_PROJECT_BY_ID}/${id}`
      );

      if (result.success) {
        setProjectData(result.data);
        setFormData({
          projectName: result.data.projectName || "",
          notes: result.data.notes || "",
          status: result.data.status || "pending",
        });

        // Parse label URLs
        const existingLabels = result.data.labelUrl
          ? result.data.labelUrl.split(",").map((url) => ({ url: url.trim() }))
          : [];
        setLabels(existingLabels);
      } else {
        console.error("Failed to fetch project details:", result.message);
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  // Helper to format file name from URL
  const getFileName = (url) => {
    if (!url) return "N/A";
    return url.trim();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Project Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Loading project data...</span>
          </div>
        ) : projectData ? (
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-lg font-medium mb-3">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="id" className="flex items-center text-sm">
                    <span className="mr-1">Project ID</span>
                  </Label>
                  <Input
                    id="id"
                    value={projectData.id || ""}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="userId" className="flex items-center text-sm">
                    <span className="mr-1">User ID</span>
                  </Label>
                  <Input
                    id="userId"
                    value={projectData.userId || ""}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label
                  htmlFor="projectName"
                  className="flex items-center text-sm"
                >
                  <span className="mr-1">Project Name</span>
                </Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label
                    htmlFor="fileName"
                    className="flex items-center text-sm"
                  >
                    <FileText className="h-4 w-4 mr-1 text-gray-400" />
                    <span>File Name</span>
                  </Label>

                  <a href={projectData.fileName}>
                    <div className="bg-white text-gray-500 px-5 py-2 rounded text-sm flex items-center mt-2 hover:text-gray-700 transition-colors">
                      <FileChartColumn className="h-4 w-4 mr-1 text-gray-400" /> 
                      <span className="text-blue-600 hover:underline truncate flex-1">
                        {projectData.fileName || ""}
                      </span> 
                    </div>
                  </a>
                </div>

                <div>
                  <Label htmlFor="status" className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Status</span>
                  </Label>
                  <Input
                    id="status"
                    value={formData.status}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="totalOrders"
                    className="flex items-center text-sm"
                  >
                    <Package className="h-4 w-4 mr-1" />
                    <span>Total Orders</span>
                  </Label>
                  <Input
                    id="totalOrders"
                    value={projectData.totalOrders || "0"}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="totalCost"
                    className="flex items-center text-sm"
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>Total Cost</span>
                  </Label>
                  <Input
                    id="totalCost"
                    value={projectData.totalCost || "0.00"}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Dates Section */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-lg font-medium mb-3">Dates</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="createdAt"
                    className="flex items-center text-sm"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created At</span>
                  </Label>
                  <Input
                    id="createdAt"
                    value={formatDate(projectData.createdAt)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="updatedAt"
                    className="flex items-center text-sm"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Updated At</span>
                  </Label>
                  <Input
                    id="updatedAt"
                    value={formatDate(projectData.updatedAt)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="processedAt"
                    className="flex items-center text-sm"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Processed At</span>
                  </Label>
                  <Input
                    id="processedAt"
                    value={formatDate(projectData.processedAt)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <Label htmlFor="notes" className="text-sm mb-2 block">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                rows={3}
                className="resize-none bg-gray-100"
                disabled
              />
            </div>

            {/* Labels Section */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-lg font-medium mb-3">Labels</h3>

              {/* Existing Labels */}
              {labels.length > 0 ? (
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {labels.map((label, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded border"
                      >
                        <a
                          href={label.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm truncate flex-1 text-blue-600 hover:underline flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-1 text-gray-400" />
                          {label.url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">No labels available</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-red-500">
            Failed to load project data
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};