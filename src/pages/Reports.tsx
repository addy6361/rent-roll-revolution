
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportsCharts } from '@/components/ReportsCharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const Reports: React.FC = () => {
  const exportReport = (type: string) => {
    // This would implement actual export functionality
    console.log('Exporting report:', type);
    alert(`${type} report export would be implemented here`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Analytics and reports for your property management
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportReport('Payment')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Payment Report
          </Button>
          <Button onClick={() => exportReport('Occupancy')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Occupancy Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="summary">Summary Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <ReportsCharts />
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
                <CardDescription>Key metrics for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>• Total Properties: Loading...</p>
                  <p>• Total Occupants: Loading...</p>
                  <p>• Collection Rate: Loading...</p>
                  <p>• Occupancy Rate: Loading...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Business performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>• Best Performing Property: Loading...</p>
                  <p>• Average Rent: Loading...</p>
                  <p>• Pending Collections: Loading...</p>
                  <p>• Growth Rate: Loading...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
