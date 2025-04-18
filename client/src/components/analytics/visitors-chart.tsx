import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { VisitorsOverTimeData } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

interface VisitorsChartProps {
  data?: VisitorsOverTimeData;
  isLoading: boolean;
  onIntervalChange: (interval: 'day' | 'week' | 'month') => void;
  interval: 'day' | 'week' | 'month';
}

export default function VisitorsChart({ 
  data, 
  isLoading,
  onIntervalChange,
  interval
}: VisitorsChartProps) {

  // Format the date for display in the chart
  const formatChartDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      
      if (interval === 'day') {
        return format(date, 'MMM d');
      } else if (interval === 'week') {
        return `Week of ${format(date, 'MMM d')}`;
      } else if (interval === 'month') {
        return format(date, 'MMM yyyy');
      }
      
      return format(date, 'MMM d');
    } catch (e) {
      return dateStr;
    }
  };

  // Format values for the tooltip
  const formatTooltipValue = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <CardTitle className="text-lg font-semibold">Visitors Over Time</CardTitle>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={interval === 'day' ? 'default' : 'outline'}
            onClick={() => onIntervalChange('day')}
            className="px-3 py-1 text-sm"
          >
            Day
          </Button>
          <Button
            size="sm"
            variant={interval === 'week' ? 'default' : 'outline'}
            onClick={() => onIntervalChange('week')}
            className="px-3 py-1 text-sm"
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={interval === 'month' ? 'default' : 'outline'}
            onClick={() => onIntervalChange('month')}
            className="px-3 py-1 text-sm"
          >
            Month
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatChartDate}
                  tick={{ fill: '#718096', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                  tick={{ fill: '#718096', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                  tick={{ fill: '#718096', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={formatChartDate}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="visitors" 
                  name="Unique Visitors"
                  stroke="#4A90E2" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  dot={{ fill: '#4A90E2', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="pageViews" 
                  name="Page Views"
                  stroke="#34C759" 
                  strokeWidth={2}
                  dot={{ fill: '#34C759', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No data available for the selected time period</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
