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
  X,
  Upload,
  Loader2,
  FileText,
  Calendar,
  DollarSign,
  Package,
  Clock,
  FileChartColumn,
} from "lucide-react";
import { apiService } from "@/services/api";
import Constants from "@/constants";
import { format } from "date-fns";

export const EditProjectDialog = ({ open, projectId, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "",
    notes: "",
    status: "pending",
  });
  const [labels, setLabels] = useState([]);
  const [newLabels, setNewLabels] = useState([]);
  const [isUpdatingLabels, setIsUpdatingLabels] = useState(false);

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
        `${Constants.API_ENDPOINTS.ADMIN_GET_SHIPMENT_BY_ID}/${id}`
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
          ? result.data.labelUrl.split(",").map((url) => ({ url }))
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
      status: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "text/csv",
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
    ];

    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert("Một số file không đúng định dạng được cho phép (.pdf, .csv, .xls, .xlsx, .txt)");
    }
    setNewLabels((prev) => [...prev, ...validFiles]);
  };

  const removeLabel = (index) => {
    setLabels((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewLabel = (index) => {
    setNewLabels((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLabels = async () => {
    if (newLabels.length === 0) return;
  
    setIsUpdatingLabels(true);
    try {
      // Process each new label individually
      const uploadedLabels = [];
      
      for (const file of newLabels) {
        
        // Make API call
        const response = await apiService.postFormData(
          `${Constants.API_ENDPOINTS.UPDATE_PROJECT_LABELS}`, 
          {file: file, shipmentId: projectId}
        );
        
        // Check if response is successful
        if (response.success) {
          uploadedLabels.push({
            url: response.data.fileUrl
          });
        } else {
          console.error("Error uploading label:", response.message);
        }
      }
      // Add successfully uploaded labels to existing labels
      if (uploadedLabels.length > 0) {
        setLabels(prevLabels => [...prevLabels, ...uploadedLabels]);
        setNewLabels([]);
      }
  
      console.log("Labels updated successfully");
    } catch (err) {
      console.error("Error updating labels:", err);
    } finally {
      setIsUpdatingLabels(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Create form data to send
      const dataToSend = {
        labels: labels.map((label) => label.url),
        status : formData.status,
        notes: formData.notes,
      }
      console.log("🚀 ~ handleSave ~ dataToSend:", dataToSend)

      // In a real implementation, replace this with your actual API call
      const response = await apiService.put(`${Constants.API_ENDPOINTS.UPDATE_SHIPMENT}/${projectId}`, dataToSend);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!response.success) {
        console.error("Error saving project:", response.message);
        return;
      }

      onClose();
    } catch (err) {
      console.error("Error saving project:", err);
    } finally {
      setIsSaving(false);
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
    return url.split("/").pop();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
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
                    <div className="bg-white text-gray-500 px-5 py-2  rounded text-sm flex items-center mt-2 hover:text-gray-700 transition-colors">
                    <FileChartColumn className="h-4 w-4 mr-1 text-gray-400" /> 
                    <span className="text-blue-600 hover:underline truncate flex-1">
                      {getFileName(projectData.fileName) || ""}
                    </span> 
                    </div>
                  </a>
                </div>

                <div>
                  <Label htmlFor="status" className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Status</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hold">Hold</SelectItem>
                    </SelectContent>
                  </Select>
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
                onChange={handleInputChange}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Labels Section */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Labels</h3>
                {newLabels.length > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    className={"cursor-pointer"}
                    onClick={updateLabels}
                    disabled={isUpdatingLabels}
                  >
                    {isUpdatingLabels ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Labels"
                    )}
                  </Button>
                )}
              </div>

              {/* Existing Labels */}
              {labels.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Existing Labels</h4>
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
                          {label.url.split("/").pop()}
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLabel(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Labels */}
              {newLabels.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">New Labels</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {newLabels.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-100"
                      >
                        <span className="text-sm truncate flex-1 flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-blue-500" />
                          {file.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNewLabel(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Label Button */}
              <div className="mt-2">
                <Label htmlFor="upload-labels" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-500 transition-colors">
                    <Upload className="mx-auto h-6 w-6 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium">
                      Upload PDF Labels
                    </span>
                    <span className="text-xs text-gray-500">
                      Click to browse or drag & drop
                    </span>
                  </div>
                  <input
                    id="upload-labels"
                    type="file"
                    multiple
                    accept=".csv,.xlsx,.xls,.pdf,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>
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
            variant="outline"
            onClick={onClose}
            disabled={isSaving || isUpdatingLabels}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving || isUpdatingLabels || !projectData}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
