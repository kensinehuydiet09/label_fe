import React, { useState } from 'react';
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const CreateProjectDialog = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setFileError("");
    
    if (!file) return;
    
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setFileError("Please upload a valid CSV or Excel file.");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setFileError("File size must be less than 10MB");
      return;
    }
    
    setSelectedFile(file);
  };

  const handleCreateProject = () => {
    // Here you would typically send the data to your API
    console.log({
      name: projectName,
      description: projectDescription,
      file: selectedFile
    });
    
    // Reset form
    setProjectName("");
    setProjectDescription("");
    setSelectedFile(null);
    setFileError("");
    
    // Close dialog
    onClose();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
          <DialogDescription>
            Create a new data analysis project by uploading a file or starting from scratch
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="upload" className="w-full mt-2" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="template">Use Template</TabsTrigger>
          </TabsList>
          
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
            
            <TabsContent value="upload" className="space-y-4 mt-0">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!selectedFile ? (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">Drag & drop your file here</p>
                    <p className="text-xs text-muted-foreground mb-4">CSV or Excel files supported, up to 10MB</p>
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => {}}>
                        Browse Files
                      </Button>
                      <Input 
                        id="file-upload" 
                        type="file" 
                        className="sr-only" 
                        accept=".csv,.xlsx,.xls" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-3" />
                      <div className="text-left">
                        <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {fileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
              
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Tips for upload</AlertTitle>
                <AlertDescription className="text-xs">
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>Make sure your file has headers in the first row</li>
                    <li>CSV files should use comma as separator</li>
                    <li>Date columns should follow YYYY-MM-DD format</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="template" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-100 rounded-md">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">Popular</Badge>
                  </div>
                  <h3 className="font-medium">Sales Data</h3>
                  <p className="text-xs text-muted-foreground">Monthly sales performance analysis template</p>
                </div>
                
                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-medium">Customer Survey</h3>
                  <p className="text-xs text-muted-foreground">Template for customer feedback analysis</p>
                </div>
                
                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-purple-100 rounded-md">
                      <FileSpreadsheet className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="font-medium">Blank Template</h3>
                  <p className="text-xs text-muted-foreground">Start from scratch with a blank template</p>
                </div>
                
                <div className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-orange-100 rounded-md">
                      <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="font-medium">Marketing Analytics</h3>
                  <p className="text-xs text-muted-foreground">Campaign performance tracking template</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="gap-2 sm:justify-start">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleCreateProject}
            disabled={!projectName || (activeTab === "upload" && !selectedFile)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};