import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
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
  Pencil,
  FileUp,
  File,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { apiService } from '@/services/api';
import Constants from '@/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EditProjectDialog = ({ 
  open, 
  projectId, 
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [projectData, setProjectData] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    status: '',
    notes: ''
  });
  const [fileUpload, setFileUpload] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (open && projectId) {
      fetchProjectDetails(projectId);
    }
  }, [open, projectId]);

  const fetchProjectDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await apiService.get(`${Constants.API_ENDPOINTS.ADMIN_GET_SHIPMENT_BY_ID}/${id}`);
      
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
      setUploadError('');
    }
  };

  const handleFileUpload = async () => {
    if (!fileUpload) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploadLoading(true);
    setUploadSuccess(false);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', fileUpload);
      formData.append('projectId', projectId);

      const response = await apiService.post(
        'admin/shipments/labels', 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.success) {
        setUploadSuccess(true);
        setFileUpload(null);
        // Refresh project data to show new labels
        fetchProjectDetails(projectId);
      } else {
        setUploadError(response.message || 'Upload failed');
      }
    } catch (err) {
      setUploadError('Error uploading file: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadLoading(false);
    }
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

  const getFileIcon = (fileName) => {
    if (!fileName) return <File className="h-4 w-4" />;
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    }
    
    return <File className="h-4 w-4" />;
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Project Details</span>
            <div className="flex gap-2 mt-4">
              <Button 
                variant={isEditMode ? "outline" : "default"} 
                size="sm" 
                onClick={toggleEditMode}
                disabled={isLoading || activeTab !== "details"}
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
          <DialogDescription>
            Manage project information, labels and files
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </div>
        ) : projectData ? (
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols mb-4">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              {/* <TabsTrigger value="labels">Labels & Files</TabsTrigger> */}
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
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
                  <div className="grid grid-cols-2 gap-4">
                    {/* File Name */}
                    <div className="w-[90%]">
                      <Label className="text-sm text-muted-foreground mb-1 block">File Name</Label>
                      <a
                        href={projectData.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-[#f8f9fd] hover:bg-[#e7ecff] transition text-sm text-[#3c2a92]"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-[#6b6b6b]" />
                        <span className="truncate max-w-[200px]">
                          {projectData.fileName?.split("/").pop() || "Không có file"}
                        </span>
                      </a>
                    </div>

                    <div className="w-[90%]">
                      <Label className="text-sm text-muted-foreground mb-1 block">File Labels</Label>

                      {projectData.labelUrl ? (
                        <div className="space-y-2">
                          {projectData.labelUrl
                            .split(",")
                            .map((url, index) => (
                              <a
                                key={index}
                                href={url.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-[#f8f9fd] hover:bg-[#e7ecff] transition text-sm text-[#3c2a92]"
                              >
                                <FileSpreadsheet className="h-4 w-4 text-[#6b6b6b]" />
                                <span className="truncate max-w-[200px]">
                                  {url.trim().split("/").pop()}
                                </span>
                              </a>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Chưa có file label nào.</p>
                      )}
                    </div>
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
            </TabsContent>
            
            <TabsContent value="labels" className="space-y-6">

              {/* File Upload Section */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Upload New Label File</h3>
                  </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PDF, Excel (.xlsx, .xls) and CSV files
                      </p>
                      
                      <Input
                        type="file"
                        className="mt-4"
                        accept=".pdf,.xlsx,.xls,.csv"
                        onChange={handleFileChange}
                      />
                      
                      {fileUpload && (
                        <div className="mt-2 flex items-center justify-center text-sm">
                          {getFileIcon(fileUpload.name)}
                          <span className="ml-1">{fileUpload.name}</span>
                          <span className="ml-2 text-muted-foreground">
                            ({(fileUpload.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {uploadSuccess && (
                      <Alert className="bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>
                          File uploaded successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {uploadError && (
                      <Alert className="bg-red-50 text-red-800 border-red-200">
                        <AlertDescription>
                          {uploadError}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      onClick={handleFileUpload}
                      disabled={!fileUpload || uploadLoading}
                      className="w-full"
                    >
                      {uploadLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload Label File
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
