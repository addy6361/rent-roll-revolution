
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, DollarSign, Calendar, Users } from 'lucide-react';

interface PaymentData {
  id: string;
  month: string;
  amount_due: number;
  amount_paid: number;
  status: string;
  occupant_name: string;
  property_name: string;
  payment_link: string | null;
  created_at: string;
}

export const PaymentDashboard: React.FC = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          assignments(
            occupants(full_name),
            beds(
              rooms(
                properties(name)
              )
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      return data.map(payment => ({
        id: payment.id,
        month: payment.month,
        amount_due: payment.amount_due,
        amount_paid: payment.amount_paid || 0,
        status: payment.status || 'pending',
        occupant_name: payment.assignments?.occupants?.full_name || 'Unknown',
        property_name: payment.assignments?.beds?.rooms?.properties?.name || 'Unknown',
        payment_link: payment.payment_link,
        created_at: payment.created_at,
      }));
    },
  });

  const totalDue = payments?.reduce((sum, payment) => sum + payment.amount_due, 0) || 0;
  const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount_paid, 0) || 0;
  const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
  const completedPayments = payments?.filter(p => p.status === 'paid').length || 0;

  const generatePaymentLink = async (paymentId: string) => {
    // This would integrate with your payment gateway
    console.log('Generate payment link for:', paymentId);
    // For now, just show a placeholder
    alert('Payment link generation would integrate with Paytm/UPI gateway here');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest payment transactions and status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Occupant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.occupant_name}</TableCell>
                  <TableCell>{payment.property_name}</TableCell>
                  <TableCell>{payment.month}</TableCell>
                  <TableCell>₹{payment.amount_due.toLocaleString()}</TableCell>
                  <TableCell>₹{payment.amount_paid.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generatePaymentLink(payment.id)}
                      >
                        Generate Link
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
