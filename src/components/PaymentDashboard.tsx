
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, DollarSign, Calendar, Users, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentData {
  id: string;
  month: string;
  amount_due: number;
  amount_paid: number;
  status: string;
  payment_type: string;
  due_date: string;
  occupant_name: string;
  property_name: string;
  room_label: string;
  bed_label: string;
  occupant_phone: string;
  payment_link: string | null;
  created_at: string;
}

export const PaymentDashboard: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          assignments(
            monthly_rent,
            deposit_amount,
            occupants(full_name, phone),
            beds(
              label,
              rooms(
                label,
                properties(name)
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(payment => ({
        id: payment.id,
        month: payment.month,
        amount_due: payment.amount_due,
        amount_paid: payment.amount_paid || 0,
        status: payment.status || 'pending',
        payment_type: payment.payment_type || 'rent',
        due_date: payment.due_date,
        occupant_name: payment.assignments?.occupants?.full_name || 'Unknown',
        occupant_phone: payment.assignments?.occupants?.phone || '',
        property_name: payment.assignments?.beds?.rooms?.properties?.name || 'Unknown',
        room_label: payment.assignments?.beds?.rooms?.label || 'Unknown',
        bed_label: payment.assignments?.beds?.label || 'Unknown',
        payment_link: payment.payment_link,
        created_at: payment.created_at,
      }));
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const { data, error } = await supabase
        .from('payments')
        .update({ 
          status: 'paid', 
          paid_at: new Date().toISOString(),
          amount_paid: payments?.find(p => p.id === paymentId)?.amount_due || 0
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments-dashboard'] });
      toast({
        title: 'Success',
        description: 'Payment marked as paid successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      // This would integrate with invoice generation service
      const { data, error } = await supabase
        .from('payments')
        .update({ 
          payment_link: `https://invoice.rentflow.app/pay/${paymentId}` 
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments-dashboard'] });
      toast({
        title: 'Success',
        description: 'Invoice generated successfully',
      });
      setIsInvoiceDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const totalDue = payments?.reduce((sum, payment) => sum + payment.amount_due, 0) || 0;
  const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount_paid, 0) || 0;
  const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
  const completedPayments = payments?.filter(p => p.status === 'paid').length || 0;
  const overduePayments = payments?.filter(p => 
    p.status === 'pending' && new Date(p.due_date) < new Date()
  ).length || 0;

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'pending' && new Date(dueDate) < new Date()) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'paid') return 'Paid';
    if (status === 'pending' && new Date(dueDate) < new Date()) {
      return 'Overdue';
    }
    return 'Pending';
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDue.toLocaleString()}</div>
            <p className="text-xs text-blue-100">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CreditCard className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-green-100">Total received</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-yellow-100">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overduePayments}</div>
            <p className="text-xs text-red-100">Past due date</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
            <p className="text-xs text-purple-100">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Payment Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Payment Management
          </CardTitle>
          <CardDescription>Track, manage and collect rental payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Details</TableHead>
                  <TableHead>Property Info</TableHead>
                  <TableHead>Payment Details</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{payment.occupant_name}</p>
                        <p className="text-sm text-gray-600">{payment.occupant_phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{payment.property_name}</p>
                        <p className="text-sm text-gray-600">{payment.room_label} - {payment.bed_label}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{payment.payment_type === 'deposit' ? 'Security Deposit' : `${payment.month} Rent`}</p>
                        <p className="text-sm text-gray-600">
                          {payment.payment_type === 'rent' ? 'Monthly Payment' : 'One-time Payment'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{new Date(payment.due_date).toLocaleDateString()}</p>
                        <p className={`text-sm ${new Date(payment.due_date) < new Date() && payment.status === 'pending' ? 'text-red-600' : 'text-gray-600'}`}>
                          {new Date(payment.due_date) < new Date() && payment.status === 'pending' ? 'Overdue' : 'On Time'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-bold text-lg">₹{payment.amount_due.toLocaleString()}</p>
                        {payment.amount_paid > 0 && (
                          <p className="text-sm text-green-600">Paid: ₹{payment.amount_paid.toLocaleString()}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(payment.status, payment.due_date)} border`}>
                        {getStatusText(payment.status, payment.due_date)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => markAsPaidMutation.mutate(payment.id)}
                              disabled={markAsPaidMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Paid
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsInvoiceDialogOpen(true);
                              }}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Invoice
                            </Button>
                          </>
                        )}
                        {payment.status === 'paid' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Generation Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Payment Invoice</DialogTitle>
            <DialogDescription>
              Create and send payment invoice for {selectedPayment?.occupant_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Payment Details:</h4>
              <p><strong>Tenant:</strong> {selectedPayment?.occupant_name}</p>
              <p><strong>Property:</strong> {selectedPayment?.property_name}</p>
              <p><strong>Room:</strong> {selectedPayment?.room_label} - {selectedPayment?.bed_label}</p>
              <p><strong>Amount:</strong> ₹{selectedPayment?.amount_due.toLocaleString()}</p>
              <p><strong>Type:</strong> {selectedPayment?.payment_type === 'deposit' ? 'Security Deposit' : 'Monthly Rent'}</p>
              <p><strong>Due Date:</strong> {selectedPayment?.due_date ? new Date(selectedPayment.due_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => selectedPayment && generateInvoiceMutation.mutate(selectedPayment.id)}
                disabled={generateInvoiceMutation.isPending}
                className="flex-1"
              >
                Generate & Send Invoice
              </Button>
              <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
