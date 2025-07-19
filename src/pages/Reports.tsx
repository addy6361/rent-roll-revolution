
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Home, User, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { ReportsCharts } from '@/components/ReportsCharts';

export const Reports: React.FC = () => {
  // Fetch monthly revenue data
  const { data: monthlyRevenue } = useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('amount_paid, paid_at, status')
        .eq('status', 'paid');
      
      if (error) throw error;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthPayments = data.filter(payment => {
        if (!payment.paid_at) return false;
        const paymentDate = new Date(payment.paid_at);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      });
      
      const totalRevenue = thisMonthPayments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);
      
      // Calculate previous month for comparison
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const prevMonthPayments = data.filter(payment => {
        if (!payment.paid_at) return false;
        const paymentDate = new Date(payment.paid_at);
        return paymentDate.getMonth() === prevMonth && paymentDate.getFullYear() === prevYear;
      });
      
      const prevRevenue = prevMonthPayments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);
      const growth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      
      return { totalRevenue, growth };
    },
  });

  // Fetch occupancy data
  const { data: occupancyData } = useQuery({
    queryKey: ['occupancy-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beds')
        .select('occupancy_status');
      
      if (error) throw error;
      
      const totalBeds = data.length;
      const occupiedBeds = data.filter(bed => bed.occupancy_status === 'occupied').length;
      const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
      
      return { occupancyPercentage, totalBeds, occupiedBeds };
    },
  });

  // Fetch active tenants count
  const { data: tenantsData } = useQuery({
    queryKey: ['active-tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          id,
          occupant_id,
          beds(
            rooms(
              properties(id, name)
            )
          )
        `)
        .is('end_date', null); // Active assignments
      
      if (error) throw error;
      
      const activeTenants = data.length;
      const uniqueProperties = new Set(data.map(assignment => 
        assignment.beds?.rooms?.properties?.id
      )).size;
      
      return { activeTenants, uniqueProperties };
    },
  });

  // Fetch pending payments
  const { data: pendingPayments } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          amount_due,
          amount_paid,
          assignments(
            occupant_id
          )
        `)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      const totalPending = data.reduce((sum, payment) => {
        const pendingAmount = (payment.amount_due || 0) - (payment.amount_paid || 0);
        return sum + pendingAmount;
      }, 0);
      
      const uniqueTenants = new Set(data.map(payment => 
        payment.assignments?.occupant_id
      )).size;
      
      return { totalPending, uniqueTenants };
    },
  });

  return (
    <div className="space-y-4 md:space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Generate detailed reports and export data
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Select defaultValue="6months">
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border">
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border">
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="property1">Property A</SelectItem>
              <SelectItem value="property2">Property B</SelectItem>
              <SelectItem value="property3">Property C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Monthly Revenue */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Monthly Revenue</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  ₹{monthlyRevenue?.totalRevenue ? monthlyRevenue.totalRevenue.toLocaleString() : '0'}
                </p>
                <div className="flex items-center mt-1">
                  {(monthlyRevenue?.growth || 0) >= 0 ? (
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1 flex-shrink-0" />
                  )}
                  <span className={`text-xs sm:text-sm ${(monthlyRevenue?.growth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(monthlyRevenue?.growth || 0) >= 0 ? '+' : ''}{(monthlyRevenue?.growth || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0 ml-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg Occupancy */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg Occupancy</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  {occupancyData?.occupancyPercentage || 0}%
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                  {occupancyData?.occupiedBeds || 0} of {occupancyData?.totalBeds || 0} beds
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Tenants */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Active Tenants</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  {tenantsData?.activeTenants || 0}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                  {tenantsData?.uniqueProperties || 0} properties
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0 ml-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Pending Payments</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                  ₹{pendingPayments?.totalPending ? pendingPayments.totalPending.toLocaleString() : '0'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                  {pendingPayments?.uniqueTenants || 0} tenants
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0 ml-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="w-full">
        <ReportsCharts />
      </div>
    </div>
  );
};
