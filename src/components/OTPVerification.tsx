
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Mail, Timer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onVerified, onBack }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Email verified successfully!');
        setTimeout(() => onVerified(), 1500);
      }
    } catch (err: any) {
      setError('Verification failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Verification code resent to your email');
        setTimeLeft(300);
        setCanResend(false);
      }
    } catch (err: any) {
      setError('Failed to resend code. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl text-white">Verify Your Email</CardTitle>
        <CardDescription className="text-gray-300">
          We've sent a 6-digit verification code to<br />
          <span className="font-medium text-blue-300">{email}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertDescription className="text-red-300 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <AlertDescription className="text-green-300 text-sm">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Verification Code</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg bg-white/10 border-white/20 text-white" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg bg-white/10 border-white/20 text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>
        </form>

        <div className="text-center space-y-4">
          {timeLeft > 0 ? (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Timer className="h-4 w-4" />
              <span>Resend code in {formatTime(timeLeft)}</span>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend Verification Code
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            Back to Sign Up
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Check your spam folder if you don't see the email
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
