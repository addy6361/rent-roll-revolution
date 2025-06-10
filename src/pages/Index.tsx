
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, CreditCard, BarChart3, ArrowRight, Star, Zap, Shield, Clock, X, UserPlus, LogIn, CheckCircle, TrendingUp, Calendar, MessageSquare } from 'lucide-react';

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
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Building2 className="h-12 w-12" />,
      title: 'Property Management',
      description: 'Complete property portfolio management with smart allocation',
      color: 'from-blue-500 to-blue-600',
      stats: '500+ Properties',
      details: {
        mainFeatures: [
          'Multi-property portfolio dashboard',
          'Smart room & bed allocation system',
          'Real-time occupancy tracking',
          'Property maintenance scheduling',
          'Digital documentation system',
          'Location-based property mapping'
        ],
        benefits: [
          'Reduce vacancy rates by up to 40%',
          'Automate property assignments',
          'Track maintenance schedules',
          'Generate property reports instantly'
        ]
      }
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: 'Tenant Management',
      description: 'Complete tenant lifecycle management from onboarding to checkout',
      color: 'from-green-500 to-green-600',
      stats: '10K+ Tenants',
      details: {
        mainFeatures: [
          'Digital tenant onboarding',
          'KYC & document verification',
          'Automated bed assignment',
          'Tenant communication portal',
          'Move-in/move-out tracking',
          'Emergency contact management'
        ],
        benefits: [
          'Reduce onboarding time by 80%',
          'Digital KYC verification',
          'Automated tenant communications',
          'Complete tenant history tracking'
        ]
      }
    },
    {
      icon: <CreditCard className="h-12 w-12" />,
      title: 'Payment Solutions',
      description: 'Automated rent collection with multiple payment gateways',
      color: 'from-purple-500 to-purple-600',
      stats: '₹50M+ Processed',
      details: {
        mainFeatures: [
          'Automated rent collection',
          'Multiple payment gateway integration',
          'Instant payment notifications',
          'Digital invoice generation',
          'Payment reminder automation',
          'Late fee calculation & tracking'
        ],
        benefits: [
          'Reduce payment delays by 90%',
          'Automate invoice generation',
          'Track payment history',
          'Send automated reminders'
        ]
      }
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: 'Analytics & Reports',
      description: 'Advanced analytics and insights for data-driven decisions',
      color: 'from-orange-500 to-orange-600',
      stats: '200+ Reports',
      details: {
        mainFeatures: [
          'Real-time revenue analytics',
          'Occupancy rate monitoring',
          'Tenant behavior insights',
          'Financial performance reports',
          'Predictive vacancy analysis',
          'Custom dashboard creation'
        ],
        benefits: [
          'Increase revenue by 25%',
          'Predict vacancy trends',
          'Monitor key metrics',
          'Generate custom reports'
        ]
      }
    }
  ];

  const stats = [
    { label: 'Properties Managed', value: '500+', icon: Building2 },
    { label: 'Happy Tenants', value: '10K+', icon: Users },
    { label: 'Revenue Processed', value: '₹50M+', icon: TrendingUp },
    { label: 'Cities Covered', value: '25+', icon: Calendar }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'PG Owner, Mumbai',
      content: 'RentFlow has completely transformed my property management. The automated payment system alone has saved me 15 hours per week.',
      rating: 5,
      avatar: '/placeholder.svg'
    },
    {
      name: 'Priya Sharma',
      role: 'Hostel Manager, Bangalore',
      content: 'The analytics dashboard gives me insights I never had before. I can now predict occupancy trends and optimize pricing.',
      rating: 5,
      avatar: '/placeholder.svg'
    },
    {
      name: 'Amit Patel',
      role: 'Property Manager, Delhi',
      content: 'Customer support is exceptional. The team helped me migrate all my data seamlessly. Highly recommended!',
      rating: 5,
      avatar: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">RentFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              #1 Property Management Platform in India
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Simplify Your{' '}
              <span className="text-primary">Property Management</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The most comprehensive property management software for PGs, hostels, and rental properties. 
              Automate operations, increase revenue, and delight your tenants.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Manage Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for property managers in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-border hover:border-primary/50 ${
                  activeFeature === index ? 'ring-2 ring-primary shadow-lg scale-105' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
                onClick={() => setSelectedFeature(index)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="text-sm font-medium text-primary">{feature.stats}</div>
                  <Button variant="ghost" size="sm" className="mt-4 text-primary hover:text-primary/80">
                    Explore Features →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      {selectedFeature !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-8 max-w-4xl w-full border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${features[selectedFeature].color} flex items-center justify-center text-white`}>
                  {features[selectedFeature].icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground">{features[selectedFeature].title}</h3>
                  <p className="text-muted-foreground">{features[selectedFeature].description}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedFeature(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-4">Key Features</h4>
                <div className="space-y-3">
                  {features[selectedFeature].details.mainFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-4">Benefits</h4>
                <div className="space-y-3">
                  {features[selectedFeature].details.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-8 bg-primary hover:bg-primary/90"
              onClick={() => navigate('/auth')}
            >
              Get Started with {features[selectedFeature].title}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Property Managers Across India
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers have to say about RentFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Property Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of property managers who have streamlined their operations with RentFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold"
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

      {/* Footer */}
      <footer className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">RentFlow</span>
            </div>
            <div className="flex items-center space-x-6 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 RentFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
