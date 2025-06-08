
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, CreditCard, BarChart3, ArrowRight, CheckCircle, Star, Play, Zap, Shield, Clock } from 'lucide-react';

export const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: 'Property Management',
      description: 'Manage multiple properties, rooms, and beds with ease',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Occupant Tracking',
      description: 'Keep track of all your tenants and their assignments',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Payment Management',
      description: 'Automate rent collection and generate payment links',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Analytics & Reports',
      description: 'Get insights into your rental business performance',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const benefits = [
    'Save 10+ hours per week on manual tasks',
    'Reduce payment delays by 80%',
    'Track occupancy rates in real-time',
    'Generate professional invoices instantly',
    'WhatsApp integration for easy communication',
    'Mobile-responsive design for on-the-go management'
  ];

  const testimonials = [
    {
      name: 'Raj Patel',
      role: 'PG Owner, Mumbai',
      content: 'RentFlow transformed how I manage my 3 properties. Payment collection is now automated!',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Hostel Manager, Bangalore',
      content: 'The analytics feature helps me optimize my occupancy rates. Highly recommended!',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      role: 'Property Manager, Delhi',
      content: 'Easy to use interface and excellent customer support. Worth every penny!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with 3D Effects */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Revolutionizing Rental Management
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Welcome to RentFlow
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most powerful and intuitive property management software for PGs, hostels, and rental properties in India
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>No Setup Fee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-10 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }} />
      </section>

      {/* Animated Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Rentals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your property management with our comprehensive suite of tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`
                  group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                  ${activeFeature === index ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : 'hover:shadow-xl'}
                `}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose RentFlow?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of property managers who have transformed their business with RentFlow
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              {/* 3D Dashboard Preview */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-12 rounded-t-lg flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-blue-100 rounded"></div>
                    <div className="h-16 bg-green-100 rounded"></div>
                    <div className="h-16 bg-purple-100 rounded"></div>
                  </div>
                  <div className="h-24 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Property Managers
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about RentFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Rental Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of property managers already using RentFlow to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/auth')}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};
