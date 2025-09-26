'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import PaymentProcessor from '@/components/payment-processor';
import { useToast } from '@/components/ui/use-toast';

interface Payment {
  _id: string;
  paymentIntentId: string;
  orderId: string;
  amount: number;
  currency: string;
  gateway: 'stripe' | 'razorpay';
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  transactionFee: number;
  createdAt: string;
  confirmedAt?: string;
  refundedAt?: string;
}

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  pendingPayments: number;
  refundedPayments: number;
  monthlyRevenue: number;
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalPayments: 0,
    totalAmount: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    refundedPayments: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{ orderId: string; amount: number } | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // Fetch payments based on user role
      const endpoint = user?.role === 'buyer' 
        ? '/payments/buyer' 
        : user?.role === 'seller' 
        ? '/payments/seller'
        : '/payments';

      const response = await api.get(endpoint);
      
      if (response.data.success) {
        setPayments(response.data.payments);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = (paymentIntentId: string) => {
    toast({
      title: 'Payment Successful',
      description: `Payment ${paymentIntentId} has been processed successfully`,
    });
    setShowPaymentModal(false);
    setSelectedOrder(null);
    fetchPayments(); // Refresh payment data
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment Failed',
      description: error,
      variant: 'destructive',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGatewayIcon = (gateway: string) => {
    return gateway === 'stripe' ? 'Stripe' : 'Razorpay';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-600">Manage your payment transactions</p>
        </div>
        <Button onClick={fetchPayments} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              All time payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Including transaction fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPayments > 0 
                ? Math.round((stats.successfulPayments / stats.totalPayments) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {payments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No payment transactions found</p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setSelectedOrder({ orderId: 'demo-order', amount: 1000 });
                    setShowPaymentModal(true);
                  }}
                >
                  Make a Test Payment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your payment transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment._id}>
                        <TableCell className="font-medium">{payment.orderId}</TableCell>
                        <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getGatewayIcon(payment.gateway)}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>₹{payment.transactionFee.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>Your saved cards and payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Stripe</span>
                    <Badge>60%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Razorpay</span>
                    <Badge>40%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Successful</span>
                    <Badge className="bg-green-500">{stats.successfulPayments}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending</span>
                    <Badge className="bg-yellow-500">{stats.pendingPayments}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Refunded</span>
                    <Badge className="bg-blue-500">{stats.refundedPayments}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Process Payment</CardTitle>
              <CardDescription>Complete your payment securely</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentProcessor
                amount={selectedOrder.amount}
                orderId={selectedOrder.orderId}
                onPaymentComplete={handlePaymentComplete}
                onPaymentError={handlePaymentError}
              />
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedOrder(null);
                }}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}