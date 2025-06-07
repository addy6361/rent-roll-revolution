
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, CreditCard, TrendingUp, Loader2, PlayCircle } from 'lucide-react';
import { OnboardingGuide } from '@/components/OnboardingGuide';
import { createDemoData, hasDemoData } from '@/utils/demoData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const Dashboard: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [propertiesResult, occupantsResult, paymentsResult] = await Promise.all([
        supabase.from('properties').select('id'),
        supabase.from('occupants').select('id'),
        supabase.from('payments').select('amount_paid, status').eq('status', 'paid')
      ]);

      const totalRentCollected = paymentsResult.data?.reduce((sum, payment) => 
        sum + (payment.amount_paid || 0), 0) || 0;

      return {
        totalProperties: propertiesResult.data?.length || 0,
        totalOccupants: occupantsResult.data?.length || 0,
        totalRentCollected,
        paidPayments: paymentsResult.data?.length || 0
      };
    },
  });

  const checkAndShowOnboarding = async () => {
    if (user) {
      const hasData = await hasDemoData(user.id);
      if (!hasData) {
        // Check if user has seen onboarding before (you could store this in localStorage or user preferences)
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }
    }
  };

  useEffect(() => {
    checkAndShowOnboarding();
  }, [user]);

  const handleCreateDemoData = async () => {
    if (!user) return;
    
    setIsCreatingDemo(true);
    try {
      const success = await createDemoData(user.id);
      if (success) {
        toast({
          title: 'Demo Data Created',
          description: 'Sample properties, occupants, and payments have been added to help you explore RentFlow.',
        });
        // Refresh stats
        window.location.reload();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create demo data. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while creating demo data.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const startOnboardingGuide = () => {
    setShowOnboarding(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Building2,
      description: 'Properties under management',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Occupants',
      value: stats?.totalOccupants || 0,
      icon: Users,
      description: 'Current tenants',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Rent Collected',
      value: `₹${stats?.totalRentCollected?.toLocaleString() || 0}`,
      icon: CreditCard,
      description: 'Total payments received',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Paid Payments',
      value: stats?.paidPayments || 0,
      icon: TrendingUp,
      description: 'Successful transactions',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Overview of your property management
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            onClick={startOnboardingGuide}
            className="flex items-center space-x-2"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Quick Guide</span>
          </Button>
          {stats && stats.totalProperties === 0 && (
            <Button 
              onClick={handleCreateDemoData}
              disabled={isCreatingDemo}
              className="flex items-center space-x-2"
            >
              {isCreatingDemo && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Add Demo Data</span>
            </Button>
          )}
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {stats && stats.totalProperties === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Welcome to RentFlow! 🎉</CardTitle>
            <CardDescription className="text-blue-700">
              Get started by exploring our demo data or adding your own properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-4">
              New to RentFlow? We recommend starting with our demo data to understand how the system works, 
              then following our quick guide to set up your own properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleCreateDemoData} disabled={isCreatingDemo}>
                {isCreatingDemo && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Sample Data
              </Button>
              <Button variant="outline" onClick={startOnboardingGuide}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Next Steps</CardTitle>
            <CardDescription>
              Complete your property management setup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm sm:text-base font-medium">Add Properties</span>
              </div>
              <span className="text-xs sm:text-sm text-blue-600">Configure</span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm sm:text-base font-medium">Add Occupants</span>
              </div>
              <span className="text-xs sm:text-sm text-green-600">Available</span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm sm:text-base font-medium">Setup Payments</span>
              </div>
              <span className="text-xs sm:text-sm text-purple-600">Available</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats && stats.totalProperties > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Properties Added</span>
                  <span className="text-sm font-medium">{stats.totalProperties}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Active Occupants</span>
                  <span className="text-sm font-medium">{stats.totalOccupants}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Payments Received</span>
                  <span className="text-sm font-medium">₹{stats.totalRentCollected?.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Building2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-40" />
                <p className="text-sm sm:text-base">No recent activity</p>
                <p className="text-xs sm:text-sm mt-1">Start by adding your first property</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Guide */}
      <OnboardingGuide 
        isOpen={showOnboarding} 
        onClose={handleCloseOnboarding}
      />
    </div>
  );
};
