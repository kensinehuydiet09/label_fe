import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Pencil, 
  Trash2, 
  Search, 
  PlusCircle, 
  Filter, 
  ArrowUpDown,
  FileSpreadsheet,
  Calendar,
  Activity,
  Clock,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectDialog } from '@/components/project/CreateProjectDialog';

const Projects = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const projects = [
    { 
      id: 1, 
      name: "Data Analytics Dashboard", 
      status: "Active", 
      date: "2024-04-08",
      progress: 75,
      owner: "John Doe",
      lastUpdated: "2 hours ago"
    },
    { 
      id: 2, 
      name: "Customer Feedback Analysis", 
      status: "Completed", 
      date: "2024-04-07",
      progress: 100,
      owner: "Jane Smith",
      lastUpdated: "Yesterday"
    },
    { 
      id: 3, 
      name: "Market Research Report", 
      status: "Active", 
      date: "2024-04-06",
      progress: 45,
      owner: "Alex Johnson",
      lastUpdated: "3 days ago"
    },
    { 
      id: 4, 
      name: "Product Survey Results", 
      status: "On Hold", 
      date: "2024-04-05",
      progress: 30,
      owner: "Sarah Williams",
      lastUpdated: "1 week ago"
    },
    { 
      id: 5, 
      name: "Quarterly Sales Analysis", 
      status: "Draft", 
      date: "2024-04-04",
      progress: 15,
      owner: "Michael Brown",
      lastUpdated: "2 days ago"
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6 container mx-auto py-6 px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage and track your data analysis projects</p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Project Statistics</CardTitle>
            <CardDescription>Overview of your project portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'Active').length}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'Completed').length}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">On Hold/Draft</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'On Hold' || p.status === 'Draft').length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects or owners..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Status: {statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('All')}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('On Hold')}>
                  On Hold
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Draft')}>
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-medium">
                  <div className="flex items-center">
                    Project Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Created
                  </div>
                </TableHead>
                <TableHead className="font-medium">Progress</TableHead>
                <TableHead className="font-medium">Owner</TableHead>
                <TableHead className="text-right font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{project.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              project.progress === 100
                                ? 'bg-green-600'
                                : project.progress > 60
                                ? 'bg-blue-600'
                                : 'bg-yellow-400'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{project.owner}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Project</DialogTitle>
                              <DialogDescription>
                                Make changes to your project here.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Project Name</Label>
                                <Input id="edit-name" defaultValue={project.name} />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <select 
                                  id="edit-status" 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  defaultValue={project.status}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Completed">Completed</option>
                                  <option value="On Hold">On Hold</option>
                                  <option value="Draft">Draft</option>
                                </select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-progress">Progress (%)</Label>
                                <Input 
                                  id="edit-progress" 
                                  type="number" 
                                  min="0" 
                                  max="100" 
                                  defaultValue={project.progress} 
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Project</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete "{project.name}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:justify-start">
                              <Button variant="ghost">Cancel</Button>
                              <Button variant="destructive">Delete Project</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No projects found. Try changing your search or filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <CreateProjectDialog open={isCreateDialogOpen} onClose={handleCreateDialogClose} />
    </Layout>
  );
};

export default Projects;