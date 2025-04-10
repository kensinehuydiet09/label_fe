import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit2, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { apiService } from "@/services/api";
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'sonner';
import Constants from '@/constants';

const Setting = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [formData, setFormData] = useState({
        setting_name: '',
        setting_key: '',
        setting_value: '',
        setting_status: 'active'
    });

    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchSettings();
    }, [debouncedSearch, statusFilter, pagination.currentPage]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            let url = `${Constants.API_ENDPOINTS.ADMIN_GET_SETTINGS}?page=${pagination.currentPage}`;
            
            if (debouncedSearch) {
                url += `&search=${debouncedSearch}`;
            }
            
            if (statusFilter !== 'all') {
                url += `&status=${statusFilter}`;
            }
            
            const response = await apiService.get(url);
            if (response.success) {
                setSettings(response.data.settings);
                setPagination({
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalItems: response.data.totalItems,
                    itemsPerPage: response.data.itemsPerPage
                });
            }
        } catch (error) {
            toast.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({
            ...prev,
            currentPage: page
        }));
    };

    const handleEdit = async (item) => {
        try {
            const response = await apiService.get(`${Constants.API_ENDPOINTS.ADMIN_GET_SETTING_BY_ID}/${item.id}`);
            if (response.success) {
                setEditingItem(item);
                const { setting_type, ...formFields } = response.data; // Remove type field
                setFormData(formFields);
                setIsOpenDialog(true);
            }
        } catch (error) {
            toast.error('Failed to fetch setting details');
        }
    };

    const openDeleteDialog = (item) => {
        setDeletingItem(item);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await apiService.delete(`${Constants.API_ENDPOINTS.ADMIN_DELETE_SETTING}/${deletingItem.id}`);
            toast.success('Setting deleted successfully');
            setIsDeleteDialogOpen(false);
            setDeletingItem(null);
            fetchSettings();
        } catch (error) {
            toast.error('Failed to delete setting');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await apiService.put(`${Constants.API_ENDPOINTS.ADMIN_UPDATE_SETTING}/${editingItem.id}`, formData);
                toast.success('Setting updated successfully');
            } else {
                await apiService.post(`${Constants.API_ENDPOINTS.ADMIN_CREATE_SETTING}`, formData);
                toast.success('Setting created successfully');
            }
            setIsOpenDialog(false);
            setEditingItem(null);
            resetForm();
            fetchSettings();
        } catch (error) {
            toast.error(editingItem ? 'Failed to update setting' : 'Failed to create setting');
        }
    };

    const resetForm = () => {
        setFormData({
            setting_name: '',
            setting_key: '',
            setting_value: '',
            setting_status: 'active'
        });
    };

    return (
        <Layout>
            <div className="container p-4 mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold">Settings Management</CardTitle>
                        <Button onClick={() => setIsOpenDialog(true)} size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Setting
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search settings..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mobile View - Cards */}
                        <div className="grid gap-4 md:hidden">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : settings.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No settings found
                                </div>
                            ) : (
                                settings.map((setting) => (
                                    <Card key={setting.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium">{setting.setting_name}</h3>
                                                    <p className="text-sm text-muted-foreground mb-1">{setting.setting_key}</p>
                                                    <p className="text-sm truncate">{setting.setting_value}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        setting.setting_status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    } mb-2`}>
                                                        {setting.setting_status}
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(setting)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(setting)}
                                                            className="h-8 w-8 p-0 text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Desktop View - Table */}
                        <div className="hidden md:block overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Key</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12">
                                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                            </TableCell>
                                        </TableRow>
                                    ) : settings.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                No settings found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        settings.map((setting) => (
                                            <TableRow key={setting.id}>
                                                <TableCell className="font-medium">{setting.setting_name}</TableCell>
                                                <TableCell>{setting.setting_key}</TableCell>
                                                <TableCell className="max-w-md truncate">{setting.setting_value}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        setting.setting_status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {setting.setting_status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(setting)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(setting)}
                                                            className="h-8 w-8 p-0 text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {!loading && settings.length > 0 && pagination.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
                                <p className="text-sm text-muted-foreground order-2 sm:order-1">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </p>
                                <div className="flex gap-1 order-1 sm:order-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Create/Edit Dialog */}
                <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? 'Edit Setting' : 'Add Setting'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="setting_name">Setting Name</Label>
                                <Input
                                    id="setting_name"
                                    value={formData.setting_name}
                                    onChange={(e) => setFormData({...formData, setting_name: e.target.value})}
                                    placeholder="Enter setting name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="setting_key">Setting Key</Label>
                                <Input
                                    id="setting_key"
                                    value={formData.setting_key}
                                    onChange={(e) => setFormData({...formData, setting_key: e.target.value})}
                                    placeholder="Enter setting key"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="setting_value">Setting Value</Label>
                                <Input
                                    id="setting_value"
                                    value={formData.setting_value}
                                    onChange={(e) => setFormData({...formData, setting_value: e.target.value})}
                                    placeholder="Enter setting value"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="setting_status">Status</Label>
                                <Select
                                    value={formData.setting_status}
                                    onValueChange={(value) => setFormData({...formData, setting_status: value})}
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
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsOpenDialog(false);
                                        setEditingItem(null);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingItem ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Confirm Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete the setting <span className="font-semibold">{deletingItem?.setting_name}</span>? 
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeletingItem(null)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Layout>
    );
};

export default Setting;
