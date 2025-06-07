
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentDashboard } from '@/components/PaymentDashboard';
import { PaymentSettings } from '@/components/PaymentSettings';

export const Payments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Track rental payments and manage payment methods
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Payment Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <PaymentDashboard />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
