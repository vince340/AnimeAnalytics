import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrafficSourceData } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ArrowDown, ArrowUp, Globe, Search, Twitter, Facebook, Youtube, MessageCircle } from 'lucide-react';

interface TrafficSourcesProps {
  data?: TrafficSourceData[];
  isLoading: boolean;
}

// Helper to get icon component for traffic source
const getSourceIcon = (icon: string) => {
  switch (icon) {
    case 'globe':
      return <Globe className="h-3 w-3" />;
    case 'search':
      return <Search className="h-3 w-3" />;
    case 'twitter':
      return <Twitter className="h-3 w-3" />;
    case 'facebook':
      return <Facebook className="h-3 w-3" />;
    case 'youtube':
      return <Youtube className="h-3 w-3" />;
    case 'reddit':
      return <MessageCircle className="h-3 w-3" />;
    default:
      return <Globe className="h-3 w-3" />;
  }
};

export default function TrafficSources({ data, isLoading }: TrafficSourcesProps) {
  // Colors for the pie chart
  const COLORS = ['#4A90E2', '#34C759', '#5856D6', '#FF9500', '#8E8E93'];
  
  // Prepare data for the chart
  const chartData = data?.slice(0, 5).map((source, index) => ({
    name: source.name,
    value: source.visitors,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-semibold">Traffic Sources</CardTitle>
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
                  outerRadius={80}
                  innerRadius={50}
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
              <p className="text-gray-500">No traffic source data available</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="py-3"><Skeleton className="h-6 w-24" /></td>
                      <td className="py-3"><Skeleton className="h-6 w-12" /></td>
                      <td className="py-3"><Skeleton className="h-6 w-12" /></td>
                      <td className="py-3"><Skeleton className="h-6 w-16" /></td>
                    </tr>
                  ))
                ) : data && data.length > 0 ? (
                  data.slice(0, 4).map((source, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-primary flex items-center justify-center mr-2">
                            {getSourceIcon(source.icon)}
                          </div>
                          <span>{source.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">{source.visitors.toLocaleString()}</td>
                      <td className="py-3 text-sm">{source.conversion}</td>
                      <td className="py-3 text-sm">
                        <div className={`flex items-center ${parseFloat(source.change) >= 0 ? 'text-secondary' : 'text-accent'}`}>
                          {parseFloat(source.change) >= 0 ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          <span>{Math.abs(parseFloat(source.change))}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No traffic sources data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
