import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeviceData } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Smartphone, Laptop, Tablet } from 'lucide-react';

interface DeviceMetricsProps {
  data?: DeviceData[];
  isLoading: boolean;
}

export default function DeviceMetrics({ data, isLoading }: DeviceMetricsProps) {
  // Colors for the pie chart
  const COLORS = ['#4A90E2', '#60A5FA', '#818CF8'];
  
  // Prepare data for the chart
  const chartData = data?.map((device, index) => ({
    name: device.name,
    value: device.count,
    color: COLORS[index % COLORS.length]
  }));

  // Helper to get device icon
  const getDeviceIcon = (deviceName: string) => {
    switch (deviceName.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="text-primary mr-2" size={16} />;
      case 'desktop':
        return <Laptop className="text-blue-400 mr-2" size={16} />;
      case 'tablet':
        return <Tablet className="text-indigo-400 mr-2" size={16} />;
      default:
        return <Laptop className="text-gray-400 mr-2" size={16} />;
    }
  };

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-semibold">Devices</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-60">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), 'Visitors']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No device data available</p>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-full mb-1" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))
          ) : data && data.length > 0 ? (
            data.map((device, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    {getDeviceIcon(device.name)}
                    <span className="text-sm">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium">{device.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="rounded-full h-2" 
                    style={{ 
                      width: `${device.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">
              No device data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
