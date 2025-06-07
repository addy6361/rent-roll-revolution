import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Mail, User } from 'lucide-react';
import { ProfileSettings } from '@/components/ProfileSettings';
import { PaymentSettings } from '@/components/PaymentSettings';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Configure your profile, payment methods, and application preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings Section */}
        <ProfileSettings />

        {/* Payment Settings Section */}
        <PaymentSettings />

        {/* Other Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>
                Set up email settings for sending invoices and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Configure SMTP settings to enable automatic email sending for:
              </p>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>• Payment link notifications</p>
                <p>• Invoice delivery</p>
                <p>• Payment reminders</p>
              </div>
              <Button variant="outline" className="w-full">
                Configure SMTP
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Payment Gateway
              </CardTitle>
              <CardDescription>
                Configure Razorpay or Stripe for payment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Set up payment gateway integration for:
              </p>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>• Payment link generation</p>
                <p>• QR code creation</p>
                <p>• Automatic payment tracking</p>
              </div>
              <Button variant="outline" className="w-full">
                Configure Payment Gateway
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
