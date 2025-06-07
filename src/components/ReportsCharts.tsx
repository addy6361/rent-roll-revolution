
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ReportsCharts: React.FC = () => {
  const { data: paymentTrends } = useQuery({
    queryKey: ['payment-trends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('month, amount_due, amount_paid, status')
        .order('month');

      if (error) throw error;

      // Group by month and calculate totals
      const monthlyData = data.reduce((acc: any, payment) => {
        const month = payment.month;
        if (!acc[month]) {
          acc[month] = { month, due: 0, collected: 0, pending: 0 };
        }
        acc[month].due += payment.amount_due;
        acc[month].collected += payment.amount_paid || 0;
        if (payment.status === 'pending') {
          acc[month].pending += payment.amount_due;
        }
        return acc;
      }, {});

      return Object.values(monthlyData);
    },
  });

  const { data: occupancyData } = useQuery({
    queryKey: ['occupancy-data'],
    queryFn: async () => {
      const { data: beds, error } = await supabase
        .from('beds')
        .select(`
          occupancy_status,
          rooms(
            properties(name)
          )
        `);

      if (error) throw error;

      // Group by property and count occupied/vacant
      const propertyData = beds.reduce((acc: any, bed) => {
        const propertyName = bed.rooms?.properties?.name || 'Unknown';
        if (!acc[propertyName]) {
          acc[propertyName] = { property: propertyName, occupied: 0, vacant: 0 };
        }
        if (bed.occupancy_status === 'occupied') {
          acc[propertyName].occupied++;
        } else {
          acc[propertyName].vacant++;
        }
        return acc;
      }, {});

      return Object.values(propertyData);
    },
  });

  const { data: overallOccupancy } = useQuery({
    queryKey: ['overall-occupancy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beds')
        .select('occupancy_status');

      if (error) throw error;

      const occupied = data.filter(bed => bed.occupancy_status === 'occupied').length;
      const vacant = data.filter(bed => bed.occupancy_status === 'vacant').length;

      return [
        { name: 'Occupied', value: occupied },
        { name: 'Vacant', value: vacant }
      ];
    },
  });

  const paymentChartConfig = {
    due: {
      label: "Amount Due",
      color: "#8884d8",
    },
    collected: {
      label: "Amount Collected",
      color: "#82ca9d",
    },
    pending: {
      label: "Pending Amount",
      color: "#ffc658",
    },
  };

  const occupancyChartConfig = {
    occupied: {
      label: "Occupied",
      color: "#0088FE",
    },
    vacant: {
      label: "Vacant", 
      color: "#00C49F",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Collection Trends</CardTitle>
            <CardDescription>Monthly payment collection vs pending amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={paymentChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="due" fill="var(--color-due)" name="Amount Due" />
                  <Bar dataKey="collected" fill="var(--color-collected)" name="Amount Collected" />
                  <Bar dataKey="pending" fill="var(--color-pending)" name="Pending Amount" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Occupancy Status</CardTitle>
            <CardDescription>Current occupied vs vacant beds</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={occupancyChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overallOccupancy}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {overallOccupancy?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Occupancy Breakdown</CardTitle>
          <CardDescription>Occupied vs vacant beds by property</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={occupancyChartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="property" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="occupied" fill="var(--color-occupied)" name="Occupied" />
                <Bar dataKey="vacant" fill="var(--color-vacant)" name="Vacant" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
