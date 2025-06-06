
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, DollarSign, Percent } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [propertiesResult, occupantsResult, paymentsResult, bedsResult] = await Promise.all([
        supabase.from('properties').select('id'),
        supabase.from('occupants').select('id'),
        supabase.from('payments').select('amount_paid, status').eq('status', 'paid'),
        supabase.from('beds').select('occupancy_status'),
      ]);

      const totalProperties = propertiesResult.data?.length || 0;
      const totalOccupants = occupantsResult.data?.length || 0;
      const totalRevenue = paymentsResult.data?.reduce((sum, payment) => sum + Number(payment.amount_paid), 0) || 0;
      const beds = bedsResult.data || [];
      const occupiedBeds = beds.filter(bed => bed.occupancy_status === 'occupied').length;
      const occupancyRate = beds.length > 0 ? (occupiedBeds / beds.length) * 100 : 0;

      return {
        totalProperties,
        totalOccupants,
        totalRevenue,
        occupancyRate,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Building2,
      description: 'Properties under management',
    },
    {
      title: 'Active Occupants',
      value: stats?.totalOccupants || 0,
      icon: Users,
      description: 'Current tenants',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      description: 'Total payments received',
    },
    {
      title: 'Occupancy Rate',
      value: `${stats?.occupancyRate?.toFixed(1) || 0}%`,
      icon: Percent,
      description: 'Beds currently occupied',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your property management overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Building2 className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p>No recent activity</p>
              <p className="text-sm">Start by adding a property</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Add New Property</h4>
                <p className="text-sm text-blue-700">Start managing a new property</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Add Occupant</h4>
                <p className="text-sm text-green-700">Register a new tenant</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Generate Report</h4>
                <p className="text-sm text-purple-700">Create payment reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
