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
} from "@/components/ui/dialog";
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

const Priceing = () => {
    const [shippingPrices, setShippingPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);
    const [formData, setFormData] = useState({
        minWeight: '',
        maxWeight: '',
        price: '',
        isActive: true,
        description: ''
    });

    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchShippingPrices();
    }, [debouncedSearch, pagination.currentPage]);

    const fetchShippingPrices = async () => {
        setLoading(true);
        try {
            let url = `${Constants.API_ENDPOINTS.ADMIN_GET_PRICES}?page=${pagination.currentPage}`;
            
            if (debouncedSearch) {
                url += `&search=${debouncedSearch}`;
            }
            
            const response = await apiService.get(url);
            if (response.success) {
                setShippingPrices(response.data.shippingPrices);
                setPagination({
                    currentPage: response.data.pagination.currentPage,
                    totalPages: response.data.pagination.totalPages,
                    totalItems: response.data.pagination.total,
                    itemsPerPage: response.data.pagination.limit,
                    hasNextPage: response.data.pagination.hasNextPage,
                    hasPrevPage: response.data.pagination.hasPrevPage
                });
            }
        } catch (error) {
            toast.error('Failed to fetch shipping prices');
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
            const response = await apiService.get(`${Constants.API_ENDPOINTS.ADMIN_GET_PRICE_BY_ID}/${item.id}`);
            if (response.success) {
                setEditingItem(item);
                setFormData({
                    minWeight: item.minWeight,
                    maxWeight: item.maxWeight,
                    price: item.price,
                    isActive: item.isActive,
                    description: item.description
                });
                setIsOpenDialog(true);
            }
        } catch (error) {
            toast.error('Failed to fetch shipping price details');
        }
    };

    const openDeleteDialog = (item) => {
        setDeletingItem(item);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await apiService.delete(`${Constants.API_ENDPOINTS.ADMIN_DELETE_PRICE}/${deletingItem.id}`);
            toast.success('Shipping price deleted successfully');
            setIsDeleteDialogOpen(false);
            setDeletingItem(null);
            fetchShippingPrices();
        } catch (error) {
            toast.error('Failed to delete shipping price');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await apiService.put(`${Constants.API_ENDPOINTS.ADMIN_UPDATE_PRICE}/${editingItem.id}`, formData);
                toast.success('Shipping price updated successfully');
            } else {
                await apiService.post(`${Constants.API_ENDPOINTS.ADMIN_CREATE_PRICE}`, formData);
                toast.success('Shipping price created successfully');
            }
            setIsOpenDialog(false);
            setEditingItem(null);
            resetForm();
            fetchShippingPrices();
        } catch (error) {
            toast.error(editingItem ? 'Failed to update shipping price' : 'Failed to create shipping price');
        }
    };

    const resetForm = () => {
        setFormData({
            minWeight: '',
            maxWeight: '',
            price: '',
            isActive: true,
            description: ''
        });
    };

    return (
        <Layout>
            <div className="container p-4 mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold">Shipping Prices Management</CardTitle>
                        <Button onClick={() => setIsOpenDialog(true)} size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Price
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                        {/* Search */}
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search shipping prices..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Mobile View - Cards */}
                        <div className="grid gap-4 md:hidden">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : shippingPrices.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No shipping prices found
                                </div>
                            ) : (
                                shippingPrices.map((price) => (
                                    <Card key={price.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium">Weight Range: {price.minWeight} - {price.maxWeight} kg</h3>
                                                    <p className="text-sm text-muted-foreground mb-1">Price: ${price.price}</p>
                                                    <p className="text-sm truncate">{price.description}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        price.isActive 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    } mb-2`}>
                                                        {price.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(price)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(price)}
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
                                        <TableHead>Weight Range (kg)</TableHead>
                                        <TableHead>Price ($)</TableHead>
                                        <TableHead>Description</TableHead>
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
                                    ) : shippingPrices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                No shipping prices found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        shippingPrices.map((price) => (
                                            <TableRow key={price.id}>
                                                <TableCell className="font-medium">{price.minWeight} - {price.maxWeight}</TableCell>
                                                <TableCell>${price.price}</TableCell>
                                                <TableCell className="max-w-md truncate">{price.description}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        price.isActive 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {price.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(price)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(price)}
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
                        {!loading && shippingPrices.length > 0 && pagination.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
                                <p className="text-sm text-muted-foreground order-2 sm:order-1">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </p>
                                <div className="flex gap-1 order-1 sm:order-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
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
                                {editingItem ? 'Edit Shipping Price' : 'Add Shipping Price'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="minWeight">Minimum Weight (kg)</Label>
                                <Input
                                    id="minWeight"
                                    type="number"
                                    step="0.01"
                                    value={formData.minWeight}
                                    onChange={(e) => setFormData({...formData, minWeight: e.target.value})}
                                    placeholder="Enter minimum weight"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxWeight">Maximum Weight (kg)</Label>
                                <Input
                                    id="maxWeight"
                                    type="number"
                                    step="0.01"
                                    value={formData.maxWeight}
                                    onChange={(e) => setFormData({...formData, maxWeight: e.target.value})}
                                    placeholder="Enter maximum weight"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    placeholder="Enter price"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Enter description"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isActive">Status</Label>
                                <select
                                    id="isActive"
                                    value={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
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
                                Are you sure you want to delete the shipping price for weight range <span className="font-semibold">{deletingItem?.minWeight} - {deletingItem?.maxWeight} kg</span>? 
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

export default Priceing;
