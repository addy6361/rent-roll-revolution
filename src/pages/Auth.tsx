
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Loader2, Shield, Zap, Users, BarChart3, ArrowLeft, CheckCircle, Clock, Star } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('signin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Account created successfully! Check your email to verify your account.');
    }

    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const { error } = await resetPassword(email);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Check your email for a password reset link!');
    }

    setIsLoading(false);
  };

  const features = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Multi-Property Management",
      description: "Manage unlimited properties from one centralized dashboard with advanced filtering and search capabilities"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Smart Tenant Tracking",
      description: "Complete tenant lifecycle management with automated lease tracking, renewal reminders, and communication tools"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automated Payments",
      description: "Streamline rent collection with automated payment processing, late fee management, and financial reporting"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Real-time insights and performance metrics with customizable reports and revenue forecasting"
    }
  ];

  const benefits = [
    "Free 30-day trial with full access",
    "No setup fees or hidden charges", 
    "24/7 customer support",
    "Bank-level security & encryption"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                RentFlow
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-border/50 hover:bg-accent/50 backdrop-blur-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-[calc(100vh-100px)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-lg">
            <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
              Transform Your 
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Property Management
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Join thousands of property managers who trust RentFlow to streamline their operations and maximize their revenue
            </p>

            <div className="space-y-8 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl border border-primary/20 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground text-xl">Enterprise Security</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your data is protected with bank-level encryption and security protocols trusted by leading financial institutions worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-secondary/5"></div>
          <div className="absolute top-32 right-32 w-64 h-64 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
          
          <div className="w-full max-w-md relative z-10">
            <Card className="border-border/50 shadow-2xl bg-background/80 backdrop-blur-md">
              <CardHeader className="space-y-4 text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Building2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  Welcome to RentFlow
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Sign in to your account or create a new one to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 backdrop-blur-sm h-12">
                    <TabsTrigger 
                      value="signin" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                    >
                      Sign Up
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reset"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                    >
                      Reset
                    </TabsTrigger>
                  </TabsList>

                  {error && (
                    <Alert className="mb-6 border-destructive/50 bg-destructive/10 backdrop-blur-sm">
                      <AlertDescription className="text-destructive font-medium">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="mb-6 border-green-500/50 bg-green-500/10 backdrop-blur-sm">
                      <AlertDescription className="text-green-700 font-medium">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <TabsContent value="signin" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          required
                          className="border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          required
                          className="border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Enter your password"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90" 
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                        <Input
                          id="signup-name"
                          name="fullName"
                          type="text"
                          required
                          className="border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          required
                          className="border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          required
                          className="border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Create a password"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90" 
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="reset" className="space-y-4">
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email" className="text-foreground">Email</Label>
                        <Input
                          id="reset-email"
                          name="email"
                          type="email"
                          required
                          className="border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90" 
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-8 text-center space-y-6">
              <div className="flex justify-center items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium">Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="font-medium">5-Star Rated</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                By signing up, you agree to our{' '}
                <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
