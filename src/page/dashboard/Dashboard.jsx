import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Truck, 
  Clock, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';

const shipmentData = [
  { name: 'Jan', delivered: 4000, pending: 2400 },
  { name: 'Feb', delivered: 3000, pending: 1398 },
  { name: 'Mar', delivered: 2000, pending: 9800 },
  { name: 'Apr', delivered: 2780, pending: 3908 },
  { name: 'May', delivered: 1890, pending: 4800 },
  { name: 'Jun', delivered: 2390, pending: 3800 },
];

const statusData = [
  { name: 'Delivered', value: 450 },
  { name: 'In Transit', value: 300 },
  { name: 'Pending', value: 200 },
  { name: 'Failed', value: 100 },
];

const paymentData = [
  { name: 'Jan', amount: 12000 },
  { name: 'Feb', amount: 15000 },
  { name: 'Mar', amount: 18000 },
  { name: 'Apr', amount: 14000 },
  { name: 'May', amount: 20000 },
  { name: 'Jun', amount: 25000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
    return (
        <Layout>
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Shipping Dashboard</h1>
                    <div className="flex gap-2">
                        <Button className="">
                            New Shipment
                        </Button>
                        <Button className=" bg-gray-200 text-black border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                            Export Report
                        </Button>
                    </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Shipments
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                In Transit
                            </CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">234</div>
                            <p className="text-xs text-muted-foreground">
                                +8% from last month
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Delivery Time
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.4 days</div>
                            <p className="text-xs text-muted-foreground">
                                -0.2 days from last month
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$12,345</div>
                            <p className="text-xs text-muted-foreground">
                                +15% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <CardHeader>
                            <CardTitle>Monthly Shipment Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={shipmentData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="delivered" fill="#0088FE" />
                                        <Bar dataKey="pending" fill="#FF8042" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-6">
                        <CardHeader>
                            <CardTitle>Shipment Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <CardHeader>
                            <CardTitle>Recent Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                        <div>
                                            <p className="font-medium">Delayed Shipment #1234</p>
                                            <p className="text-sm text-muted-foreground">Expected delivery delayed by 2 days</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-6">
                        <CardHeader>
                            <CardTitle>Payment Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={paymentData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line 
                                            type="monotone" 
                                            dataKey="amount" 
                                            stroke="#8884d8" 
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-muted-foreground">Total Payments</span>
                                </div>
                                <span className="font-medium">$104,000</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span>On-time Delivery Rate</span>
                                    </div>
                                    <span className="font-medium">95%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span>Customer Satisfaction</span>
                                    </div>
                                    <span className="font-medium">4.8/5</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span>Shipment Accuracy</span>
                                    </div>
                                    <span className="font-medium">99.9%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;