
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, CreditCard, BarChart3, ArrowRight, Star, Zap, Shield, Clock, X, UserPlus, LogIn } from 'lucide-react';

export const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
      color: 'from-blue-500 to-blue-600',
      details: [
        'Multi-property portfolio management',
        'Room and bed allocation system',
        'Real-time occupancy tracking',
        'Property maintenance scheduling',
        'Digital property documentation',
        'Location-based property mapping'
      ]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Occupant Tracking',
      description: 'Keep track of all your tenants and their assignments',
      color: 'from-green-500 to-green-600',
      details: [
        'Complete tenant profile management',
        'Digital KYC and document verification',
        'Automated bed assignment system',
        'Tenant communication portal',
        'Move-in/move-out tracking',
        'Emergency contact management'
      ]
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Payment Management',
      description: 'Automate rent collection and generate payment links',
      color: 'from-purple-500 to-purple-600',
      details: [
        'Automated rent collection system',
        'Multiple payment gateway integration',
        'Instant payment notifications',
        'Digital invoice generation',
        'Payment reminder automation',
        'Late fee calculation & tracking'
      ]
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Analytics & Reports',
      description: 'Get insights into your rental business performance',
      color: 'from-orange-500 to-orange-600',
      details: [
        'Real-time revenue analytics',
        'Occupancy rate monitoring',
        'Tenant behavior insights',
        'Financial performance reports',
        'Predictive vacancy analysis',
        'Custom dashboard creation'
      ]
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RentFlow
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-2xl">
              <Zap className="h-4 w-4" />
              Revolutionizing Rental Management
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
              Welcome to RentFlow
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most powerful and intuitive property management software for PGs, hostels, and rental properties in India
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 border-0"
                onClick={() => navigate('/auth')}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Shield className="h-4 w-4" />
                <span>Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Clock className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Zap className="h-4 w-4" />
                <span>No Setup Fee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Everything You Need to Manage Rentals
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Streamline your property management with our comprehensive suite of tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`
                  group cursor-pointer transform transition-all duration-500 hover:scale-105 bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20
                  ${activeFeature === index ? 'ring-2 ring-blue-500/50 shadow-2xl shadow-blue-500/25 scale-105' : 'hover:shadow-xl'}
                `}
                onMouseEnter={() => setActiveFeature(index)}
                onClick={() => setSelectedFeature(index)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                  <Button variant="ghost" className="mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      {selectedFeature !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${features[selectedFeature].color} flex items-center justify-center text-white`}>
                  {features[selectedFeature].icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{features[selectedFeature].title}</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedFeature(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-gray-300 mb-6">{features[selectedFeature].description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features[selectedFeature].details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  <span className="text-gray-300">{detail}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate('/auth')}
            >
              Get Started with {features[selectedFeature].title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                Why Choose RentFlow?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of property managers who have transformed their business with RentFlow
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-white/10">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-12 rounded-t-lg flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-8 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-blue-100/10 rounded"></div>
                    <div className="h-16 bg-green-100/10 rounded"></div>
                    <div className="h-16 bg-purple-100/10 rounded"></div>
                  </div>
                  <div className="h-24 bg-gray-100/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Loved by Property Managers
            </h2>
            <p className="text-xl text-gray-400">
              See what our customers have to say about RentFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transform hover:scale-105 transition-all duration-300 bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm text-white relative z-10">
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
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/auth')}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
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
