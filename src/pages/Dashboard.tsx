
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, CreditCard, AlertCircle, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { OnboardingGuide } from '@/components/OnboardingGuide';

export const Dashboard: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user is new and should see onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has completed profile setup
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Check if user has any properties
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      // Show onboarding if profile is incomplete or no properties exist
      const shouldShowOnboarding = !profile?.full_name || !profile?.phone || !properties?.length;
      
      // Also check localStorage to see if user has dismissed onboarding
      const hasSeenOnboarding = localStorage.getItem('rentflow_onboarding_completed');
      
      if (shouldShowOnboarding && !hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('rentflow_onboarding_completed', 'true');
  };

  const { data: properties } = useQuery({
    queryKey: ['properties-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('owner_id', user.id);

      return count || 0;
    },
  });

  const { data: occupants } = useQuery({
    queryKey: ['occupants-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count } = await supabase
        .from('occupants')
        .select('*', { count: 'exact' })
        .eq('owner_id', user.id);

      return count || 0;
    },
  });

  const { data: payments } = useQuery({
    queryKey: ['payments-summary'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { total: 0, pending: 0, overdue: 0 };

      // Get all assignments for this user's properties
      const { data: assignments } = await supabase
        .from('assignments')
        .select(`
          id,
          beds (
            rooms (
              properties!inner (
                owner_id
              )
            )
          )
        `)
        .eq('beds.rooms.properties.owner_id', user.id);

      if (!assignments?.length) return { total: 0, pending: 0, overdue: 0 };

      const assignmentIds = assignments.map(a => a.id);

      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount_due, status, due_date')
        .in('assignment_id', assignmentIds);

      const total = paymentsData?.reduce((sum, p) => sum + p.amount_due, 0) || 0;
      const pending = paymentsData?.filter(p => p.status === 'pending').length || 0;
      const overdue = paymentsData?.filter(p => 
        p.status === 'pending' && new Date(p.due_date) < new Date()
      ).length || 0;

      return { total, pending, overdue };
    },
  });

  const { data: occupancyRate } = useQuery({
    queryKey: ['occupancy-rate'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: beds } = await supabase
        .from('beds')
        .select(`
          occupancy_status,
          rooms (
            properties!inner (
              owner_id
            )
          )
        `)
        .eq('rooms.properties.owner_id', user.id);

      if (!beds?.length) return 0;

      const occupiedBeds = beds.filter(bed => bed.occupancy_status === 'occupied').length;
      return Math.round((occupiedBeds / beds.length) * 100);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Welcome back! Here's an overview of your rental business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties || 0}</div>
            <p className="text-xs text-blue-100">Active properties</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Occupants</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupants || 0}</div>
            <p className="text-xs text-green-100">Registered tenants</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{payments?.total.toLocaleString() || 0}</div>
            <p className="text-xs text-purple-100">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate || 0}%</div>
            <p className="text-xs text-orange-100">Current occupancy</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Pending Actions
            </CardTitle>
            <CardDescription>Items that require your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments?.pending > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium text-yellow-800">Pending Payments</p>
                  <p className="text-sm text-yellow-600">{payments.pending} payments awaiting collection</p>
                </div>
                <div className="text-2xl font-bold text-yellow-700">{payments.pending}</div>
              </div>
            )}
            
            {payments?.overdue > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-red-800">Overdue Payments</p>
                  <p className="text-sm text-red-600">{payments.overdue} payments past due date</p>
                </div>
                <div className="text-2xl font-bold text-red-700">{payments.overdue}</div>
              </div>
            )}

            {(!payments?.pending && !payments?.overdue) && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>All caught up! No pending actions.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Quick Stats
            </CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Collection Rate</span>
              <span className="font-bold text-green-600">
                {payments?.total > 0 ? Math.round(((payments.total - (payments.pending * 5000)) / payments.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Occupancy</span>
              <span className="font-bold text-blue-600">{occupancyRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Properties</span>
              <span className="font-bold text-purple-600">{properties || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Tenants</span>
              <span className="font-bold text-orange-600">{occupants || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Guide */}
      <OnboardingGuide 
        isOpen={showOnboarding} 
        onClose={handleOnboardingClose}
        autoStart={true}
      />
    </div>
  );
};
