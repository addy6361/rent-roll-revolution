
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download } from 'lucide-react';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Analytics and reports for your property management
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Reports & Analytics</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Comprehensive reporting dashboard with occupancy rates, revenue tracking, 
            and detailed analytics for your properties.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✓ Occupancy rate analytics</p>
            <p>✓ Revenue vs target reports</p>
            <p>✓ Paid vs pending payment analysis</p>
            <p>✓ Monthly/quarterly summaries</p>
            <p>✓ Export to Excel & CSV</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
