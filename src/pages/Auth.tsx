
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Loader2, Shield, Zap, Users, BarChart3 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('signin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <Building2 className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RentFlow</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Features */}
          <div className="hidden lg:block space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Transform Your Property Management
              </h2>
              <p className="text-xl text-gray-300">
                Join thousands of property managers who trust RentFlow
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: <Building2 className="h-6 w-6" />, title: "Multi-Property Management", desc: "Manage unlimited properties from one dashboard" },
                { icon: <Users className="h-6 w-6" />, title: "Smart Tenant Tracking", desc: "Complete tenant lifecycle management" },
                { icon: <Zap className="h-6 w-6" />, title: "Automated Payments", desc: "Streamline rent collection with automation" },
                { icon: <BarChart3 className="h-6 w-6" />, title: "Advanced Analytics", desc: "Real-time insights and performance metrics" }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
              <Shield className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white font-medium">Enterprise-grade Security</p>
                <p className="text-gray-400 text-sm">Your data is protected with bank-level encryption</p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Card */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="w-full bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-xl sm:text-2xl text-white">Welcome to RentFlow</CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-300">
                  Sign in to manage your rental properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/10 border-white/20">
                    <TabsTrigger value="signin" className="text-xs sm:text-sm data-[state=active]:bg-white/20 data-[state=active]:text-white">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="text-xs sm:text-sm data-[state=active]:bg-white/20 data-[state=active]:text-white">Sign Up</TabsTrigger>
                    <TabsTrigger value="reset" className="text-xs sm:text-sm data-[state=active]:bg-white/20 data-[state=active]:text-white">Reset</TabsTrigger>
                  </TabsList>

                  {error && (
                    <Alert className="mb-4 border-red-500/50 bg-red-500/10 backdrop-blur-sm">
                      <AlertDescription className="text-red-300 text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="mb-4 border-green-500/50 bg-green-500/10 backdrop-blur-sm">
                      <AlertDescription className="text-green-300 text-sm">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <TabsContent value="signin" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-sm text-gray-300">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          required
                          className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm text-gray-300">Password</Label>
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          required
                          className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                          placeholder="Enter your password"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-300" 
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
                        <Label htmlFor="signup-name" className="text-sm text-gray-300">Full Name</Label>
                        <Input
                          id="signup-name"
                          name="fullName"
                          type="text"
                          required
                          className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm text-gray-300">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          required
                          className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm text-gray-300">Password</Label>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          required
                          className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                          placeholder="Create a password"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 shadow-lg hover:shadow-green-500/25 transition-all duration-300" 
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
                        <Label htmlFor="reset-email" className="text-sm text-gray-300">Email</Label>
                        <Input
                          id="reset-email"
                          name="email"
                          type="email"
                          required
                          className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
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

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
