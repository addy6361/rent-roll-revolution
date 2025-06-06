
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';

export const Payments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Track rental payments and generate payment links
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Generate Payment
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Payments Feature</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            This feature will allow you to auto-generate monthly payments, create payment links, 
            track payment status, and send payment reminders via WhatsApp and email.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✓ Auto-create monthly payment records</p>
            <p>✓ Generate Razorpay/Stripe payment links</p>
            <p>✓ QR code generation for easy payments</p>
            <p>✓ WhatsApp & Email payment reminders</p>
            <p>✓ Payment status tracking</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
