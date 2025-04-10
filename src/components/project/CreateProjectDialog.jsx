import React, { useState, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader,
  DollarSign,
  Package,
  Weight,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Constants from "@/constants";
import { apiService } from "@/services/api";

export const CreateProjectDialog = ({ open, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success" or "error"
  const [submitMessage, setSubmitMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      const isValid = validateFile(file);

      if (isValid) {
        setSelectedFile(file);
        await uploadFile(file);
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isValid = validateFile(file);

    if (isValid) {
      setSelectedFile(file);
      await uploadFile(file);
    }
  };

  const validateFile = (file) => {
    setFileError("");
    setUploadSuccess(false);
    setFileData(null);

    if (!file) return false;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    // Check file extension as a fallback for CSV files
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidExtension = ['csv', 'xls', 'xlsx'].includes(fileExtension);

    if ((!allowedTypes.includes(file.type)) && !isValidExtension) {
      setFileError("Please upload a valid CSV or Excel file.");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setFileError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setFileError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiService.postFormData(
        Constants.API_ENDPOINTS.UPLOAD_FILE,
        { file: file }
      );

      if (response.success) {
        setUploadSuccess(true);
        setFileData(response.data);
      } else {
        setFileError(response.message || "Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateProject = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");
    
    try {
      const response = await apiService.postFormData(
        Constants.API_ENDPOINTS.CREATE_PROJECT,
        {
          projectName: projectName,
          notes: projectDescription,
          file: selectedFile,
        }
      );

      if (response.success) {
        setSubmitStatus("success");
        setSubmitMessage("Project created successfully!");
        
        // Wait 1.5 seconds to show success message before closing
        setTimeout(() => {
          // Reset form state
          setProjectName("");
          setProjectDescription("");
          setSelectedFile(null);
          setFileError("");
          setUploadSuccess(false);
          setFileData(null);
          setSubmitStatus(null);
          setIsSubmitting(false);
          onClose();
        }, 1500);
      } else {
        setSubmitStatus("error");
        setSubmitMessage(response.message || "Failed to create project. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setSubmitStatus("error");
      setSubmitMessage("Failed to create project. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedFile(null);
    setUploadSuccess(false);
    setFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClickUpload = () => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
          <DialogDescription>
            Create a new data analysis project by uploading a file
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="Enter a descriptive name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of this project"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4 mt-0">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : selectedFile
                  ? "border-green-200 bg-green-50"
                  : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
              } transition-all duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickUpload}
            >
              {!selectedFile ? (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-blue-500 mb-3" />
                  <p className="text-base font-medium mb-2">
                    Drag & drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click anywhere in this area to select a file
                  </p>
                  <Button variant="outline" size="sm" type="button" className="bg-white hover:bg-blue-50">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-4 rounded-md border border-green-100">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-10 w-10 text-blue-600 mr-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    disabled={isUploading || isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {isUploading && (
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Loader className="h-4 w-4 animate-spin" />
                <AlertTitle>Uploading</AlertTitle>
                <AlertDescription>
                  Please wait while your file is being uploaded...
                </AlertDescription>
              </Alert>
            )}

            {isSubmitting && (
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Loader className="h-4 w-4 animate-spin" />
                <AlertTitle>Creating Project</AlertTitle>
                <AlertDescription>
                  Please wait while your project is being created...
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === "success" && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{submitMessage}</AlertDescription>
              </Alert>
            )}

            {submitStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submitMessage}</AlertDescription>
              </Alert>
            )}

            {uploadSuccess && fileData && !isUploading && !isSubmitting && (
              <>
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Upload Successful</AlertTitle>
                  <AlertDescription>
                    Your file has been uploaded successfully.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h3 className="font-medium text-blue-800 mb-3">Uploaded File Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 bg-white p-3 rounded-md">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Value</p>
                        <p className="font-medium">{fileData.data.totalPrice} USD</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white p-3 rounded-md">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Orders</p>
                        <p className="font-medium">{fileData.data.totalCountedOrders} orders</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Weight className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-medium">Weight Distribution</h4>
                    </div>
                    
                    {Object.entries(fileData.data.weightRangeCounts).map(([range, count], index) => (
                      <div key={index} className="flex justify-between text-sm py-1 border-t">
                        <span className="text-muted-foreground">{range} kg:</span>
                        <span className="font-medium">{count} orders</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {fileError && !submitStatus && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}

            {!uploadSuccess && !fileError && !submitStatus && (
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Tips for upload</AlertTitle>
                <AlertDescription className="text-xs">
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>Make sure your file has headers in the first row</li>
                    <li>CSV files should use comma as separator</li>
                    <li>Date columns should follow YYYY-MM-DD format</li>
                    <li>File size limit is 10MB</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-start">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={
              !projectName ||
              !selectedFile ||
              isUploading ||
              isSubmitting
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Create Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};