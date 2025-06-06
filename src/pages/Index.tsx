
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Building2, Users, CreditCard, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Building2,
      title: 'Property Management',
      description: 'Manage multiple properties, rooms, and beds with ease',
    },
    {
      icon: Users,
      title: 'Occupant Tracking',
      description: 'Keep track of tenants and their assignments',
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Generate payment links and track rental payments',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into occupancy rates and revenue',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            <span className="text-blue-600">RentFlow</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Lightweight property management system designed for individual landlords. 
            Manage your PG, hostel, or rental properties with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
              <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-6 sm:p-8 mx-4 sm:mx-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to streamline your rentals?</h2>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6 opacity-90">
            Join property owners who trust RentFlow to manage their rentals efficiently.
          </p>
          <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
            <Link to="/auth">Start Managing Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
