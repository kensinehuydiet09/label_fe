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
  Loader2,
  MoreHorizontal,
  Eye,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManagerProject = () => {
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
  const [activeView, setActiveView] = useState('table');

  const fetchProjects = async (page = 1, limit = pageSize) => {
    setLoading(true);
    try {
      const response = await apiService.get(
        `${Constants.API_ENDPOINTS.ADMIN_GET_PROJECTS}?page=${page}&limit=${limit}`
      );
      
      if (response.success) {
        setProjects(response.data.projects);
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

  useEffect(() => {
    // Filter projects based on search query and status
    let filtered = [...projects];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.projectName.toLowerCase().includes(query) || 
        p.id.toLowerCase().includes(query) ||
        p.user?.name.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(p => p.status === statusFilter.toLowerCase());
    }
    
    // Here we would typically call API with filters instead of filtering client-side
    // For this example, we're just filtering the existing data
  }, [searchQuery, statusFilter, pageSize]);

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

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await apiService.delete(
          `${Constants.API_ENDPOINTS.ADMIN_DELETE_PROJECT}/${projectId}`
        );
        
        if (response.success) {
          fetchProjects(pagination.currentPage, pageSize);
        } else {
          console.error("Failed to delete project:", response.message);
        }
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };

  // Calculate project statistics
  const projectStats = {
    total: pagination.total || 0,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    other: projects.filter(p => !['active', 'completed'].includes(p.status)).length
  };

  // Function to handle status filtering from the card UI
  const handleStatusFilterFromCard = (status) => {
    setStatusFilter(status);
  };

  const ProjectCard = ({ project }) => (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">{project.projectName}</CardTitle>
            <CardDescription className="mt-1">ID: {project.id}</CardDescription>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(project.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owner:</span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {project.user?.name || 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Orders:</span>
            <span>{project.totalOrders}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Cost:</span>
            <span className="font-medium">${parseFloat(project.totalCost).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => handleEditProject(project.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => handleDeleteProject(project.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderPagination = () => (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button 
          variant="outline" 
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>
        <span className="flex items-center px-3 py-1 rounded-md bg-gray-100">
          {pagination.currentPage} / {pagination.totalPages}
        </span>
        <Button 
          variant="outline" 
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          size="sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
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
            <span className="text-sm text-gray-700 mr-2">Rows:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
              <SelectTrigger className="w-16 h-8 text-sm">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            
            {/* Pagination numbers */}
            <div className="flex items-center">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
                
                if (
                  pageNumber === 1 ||
                  pageNumber === pagination.totalPages ||
                  Math.abs(pageNumber - pagination.currentPage) <= (maxVisiblePages - 3) / 2
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
                  (pageNumber === 2 && pagination.currentPage > (maxVisiblePages - 1) / 2 + 1) ||
                  (pageNumber === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - (maxVisiblePages - 1) / 2)
                ) {
                  return (
                    <Button
                      key={`ellipsis-${pageNumber}`}
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
  );

    return (
        <Layout>
      <div className="space-y-4 container mx-auto py-4 px-3 md:py-6 md:px-6 max-w-7xl">
        {/* Header with responsive layout */}
        <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Manage Projects</h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">Admin panel for managing all projects</p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className=" w-full md:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStatusFilterFromCard('All')}>
            <CardContent className="flex items-center p-3 md:p-4">
              <div className="bg-blue-100 p-2 md:p-3 rounded-full mr-3">
                <FileSpreadsheet className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Projects</p>
                <p className="text-lg md:text-2xl font-bold">{projectStats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStatusFilterFromCard('active')}>
            <CardContent className="flex items-center p-3 md:p-4">
              <div className="bg-green-100 p-2 md:p-3 rounded-full mr-3">
                <Activity className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Active</p>
                <p className="text-lg md:text-2xl font-bold">{projectStats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStatusFilterFromCard('completed')}>
            <CardContent className="flex items-center p-3 md:p-4">
              <div className="bg-blue-100 p-2 md:p-3 rounded-full mr-3">
                <Clock className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Completed</p>
                <p className="text-lg md:text-2xl font-bold">{projectStats.completed}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStatusFilterFromCard('pending')}>
            <CardContent className="flex items-center p-3 md:p-4">
              <div className="bg-yellow-100 p-2 md:p-3 rounded-full mr-3">
                <AlertCircle className="h-4 w-4 md:h-6 md:w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Pending/Other</p>
                <p className="text-lg md:text-2xl font-bold">{projectStats.other}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
                <Button variant="outline" className="flex-1 md:flex-none">
                  <Filter className="mr-2 h-4 w-4" />
                  <span className="md:hidden">Filter</span>
                  <span className="hidden md:inline">Status: {statusFilter}</span>
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

            {/* Toggle between table and card views */}
            <Tabs value={activeView} onValueChange={setActiveView} className="flex-1 md:w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content area with loading state */}
        <div className="rounded-md border shadow-sm min-h-[300px]"> 
          {loading ? (
            <div className="flex flex-col justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="mt-2 text-sm md:text-base text-muted-foreground">Loading projects...</span>
            </div>
          ) : (
            <Tabs value={activeView} className="w-full">
              <TabsContent value="table" className="mt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-medium">
                          <div className="flex items-center">
                            Project Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="font-medium hidden md:table-cell">Code</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium hidden md:table-cell">Owner</TableHead>
                        <TableHead className="font-medium hidden md:table-cell">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            Created
                          </div>
                        </TableHead>
                        <TableHead className="font-medium hidden md:table-cell">Orders</TableHead>
                        <TableHead className="font-medium">Total Cost</TableHead>
                        <TableHead className="text-right font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <TableRow key={project.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{project.projectName}</TableCell>
                            <TableCell className="font-medium hidden md:table-cell">{project.id}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {project.user?.name || 'Unknown'}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground hidden md:table-cell">{formatDate(project.createdAt)}</TableCell>
                            <TableCell className="hidden md:table-cell">{project.totalOrders}</TableCell>
                            <TableCell>${parseFloat(project.totalCost).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              {/* Dropdown for mobile, buttons for desktop */}
                              <div className="md:hidden">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => handleDeleteProject(project.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              {/* Desktop actions */}
                              <div className="hidden md:flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleEditProject(project.id)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                              <FileSpreadsheet className="h-8 w-8 mb-2" />
                              <p>No projects found.</p>
                              <p className="text-sm">Try changing your search or filter criteria.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {renderPagination()}
              </TabsContent>
              
              {/* Card View for Projects */}
              <TabsContent value="cards" className="mt-0">
                {projects.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                    {renderPagination()}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileSpreadsheet className="h-12 w-12 mb-4" />
                    <p className="text-lg">No projects found.</p>
                    <p>Try changing your search or filter criteria.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Project
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
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

export default ManagerProject;