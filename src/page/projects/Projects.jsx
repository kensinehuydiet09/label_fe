import React, { useEffect, useState } from 'react';
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
import { Input } from "@/components/ui/input";
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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
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
import { EditProjectDialog } from '@/components/project/EditProjectDialog';
import { apiService } from '@/services/api';
import Constants from '@/constants';

const Projects = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [pageSize, setPageSize] = useState(10);

  const fetchProjects = async (page = 1, limit = pageSize) => {
    setLoading(true);
    try {
      const response = await apiService.get(
        `${Constants.API_ENDPOINTS.USER_GET_PROJECT}?page=${page}&limit=${limit}`
      );
      
      if (response.success) {
        setProjects(response.data.shipments);
        setPagination(response.data.pagination);
      } else {
        setProjects([]);
        console.error("Failed to fetch projects:", response.message);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1, pageSize);
  }, [pageSize]); 

  const handlePageChange = (newPage) => {
    fetchProjects(newPage, pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'on_hold': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'draft': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    fetchProjects(1, pageSize); // Refresh data after creating new project
  };

  const handleEditProject = (projectId) => {
    setSelectedProjectId(projectId);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    fetchProjects(pagination.currentPage, pageSize); // Refresh data after editing
  };

  // Calculate project statistics
  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    other: projects.filter(p => !['active', 'completed'].includes(p.status)).length
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
                  <p className="text-2xl font-bold">{pagination.total || 0}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{projectStats.active}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{projectStats.completed}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending/Other</p>
                  <p className="text-2xl font-bold">{projectStats.other}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
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
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('on_hold')}>
                  On Hold
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-lg text-muted-foreground">Loading projects...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">
                      <div className="flex items-center">
                        Project Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">Code</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Created
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">Orders</TableHead>
                    <TableHead className="font-medium">Total Cost</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{project.projectName}</TableCell>
                        <TableCell className="font-medium">{project.id}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(project.createdAt)}</TableCell>
                        <TableCell>{project.totalOrders}</TableCell>
                        <TableCell>${parseFloat(project.totalCost).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditProject(project.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
              
              {/* Pagination UI */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
                
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{projects.length > 0 ? ((pagination.currentPage - 1) * pagination.limit) + 1 : 0}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(pagination.currentPage * pagination.limit, pagination.total)}
                      </span>{" "}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
                      <select
                        className="p-1 text-sm border rounded-md bg-white"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      >
                        {[10, 25, 50, 100].map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-md"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {/* Simplified pagination numbers */}
                      <div className="flex items-center">
                        {[...Array(pagination.totalPages)].map((_, i) => {
                          const pageNumber = i + 1;
                          // Only show current page, first page, last page, and one page before and after current
                          if (
                            pageNumber === 1 ||
                            pageNumber === pagination.totalPages ||
                            Math.abs(pageNumber - pagination.currentPage) <= 1
                          ) {
                            return (
                              <Button
                                key={pageNumber}
                                variant={pageNumber === pagination.currentPage ? "default" : "outline"}
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </Button>
                            );
                          } else if (
                            pageNumber === pagination.currentPage - 2 ||
                            pageNumber === pagination.currentPage + 2
                          ) {
                            return (
                              <Button
                                key={pageNumber}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-none pointer-events-none"
                                disabled
                              >
                                ...
                              </Button>
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-md"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <CreateProjectDialog open={isCreateDialogOpen} onClose={handleCreateDialogClose} />
      <EditProjectDialog 
        open={isEditDialogOpen} 
        projectId={selectedProjectId}
        onClose={handleEditDialogClose} 
      />
    </Layout>
  );
};

export default Projects;
