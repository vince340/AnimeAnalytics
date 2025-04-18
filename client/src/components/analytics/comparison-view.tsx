import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { OverviewData, useOverviewData } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { formatDuration, formatPercentage } from '@/utils/date-utils';

interface ComparisonViewProps {
  currentStartDate: Date;
  currentEndDate: Date;
}

export default function ComparisonView({ currentStartDate, currentEndDate }: ComparisonViewProps) {
  // State for comparison date range
  const [comparisonStartDate, setComparisonStartDate] = useState<Date>(() => {
    const date = new Date(currentStartDate);
    // Set comparison date to same length but previous period
    const daysDiff = Math.round((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24));
    date.setDate(date.getDate() - daysDiff);
    return date;
  });
  
  const [comparisonEndDate, setComparisonEndDate] = useState<Date>(() => {
    const date = new Date(currentEndDate);
    const daysDiff = Math.round((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24));
    date.setDate(date.getDate() - daysDiff);
    return date;
  });
  
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  
  // Format dates for API
  const formatDateForApi = (date: Date) => format(date, 'yyyy-MM-dd');
  
  // Fetch comparison data
  const comparisonParams = {
    startDate: formatDateForApi(comparisonStartDate),
    endDate: formatDateForApi(comparisonEndDate)
  };
  
  const currentParams = {
    startDate: formatDateForApi(currentStartDate),
    endDate: formatDateForApi(currentEndDate)
  };
  
  const currentData = useOverviewData(currentParams);
  const comparisonData = useOverviewData(comparisonParams);
  
  // Apply comparison presets
  const applyPreset = (preset: 'previous_period' | 'previous_year' | 'custom') => {
    if (preset === 'previous_period') {
      const daysDiff = Math.round((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const newComparisonEndDate = new Date(currentStartDate);
      newComparisonEndDate.setDate(newComparisonEndDate.getDate() - 1);
      
      const newComparisonStartDate = new Date(newComparisonEndDate);
      newComparisonStartDate.setDate(newComparisonStartDate.getDate() - daysDiff);
      
      setComparisonStartDate(newComparisonStartDate);
      setComparisonEndDate(newComparisonEndDate);
    } 
    else if (preset === 'previous_year') {
      const newComparisonStartDate = new Date(currentStartDate);
      newComparisonStartDate.setFullYear(newComparisonStartDate.getFullYear() - 1);
      
      const newComparisonEndDate = new Date(currentEndDate);
      newComparisonEndDate.setFullYear(newComparisonEndDate.getFullYear() - 1);
      
      setComparisonStartDate(newComparisonStartDate);
      setComparisonEndDate(newComparisonEndDate);
    }
  };
  
  // Comparison metrics
  const compareMetrics = (current?: OverviewData, comparison?: OverviewData) => {
    if (!current || !comparison) return null;
    
    const calculateDifference = (currentValue: number, comparisonValue: number) => {
      if (comparisonValue === 0) return 0;
      return ((currentValue - comparisonValue) / comparisonValue) * 100;
    };
    
    return [
      {
        name: 'Unique Visitors',
        current: current.uniqueVisitors.value,
        previous: comparison.uniqueVisitors.value,
        difference: calculateDifference(current.uniqueVisitors.value, comparison.uniqueVisitors.value),
        format: (value: number) => value.toLocaleString()
      },
      {
        name: 'Page Views',
        current: current.pageViews.value,
        previous: comparison.pageViews.value,
        difference: calculateDifference(current.pageViews.value, comparison.pageViews.value),
        format: (value: number) => value.toLocaleString()
      },
      {
        name: 'Avg. Session Duration',
        current: current.avgSessionDuration.value,
        previous: comparison.avgSessionDuration.value,
        difference: calculateDifference(current.avgSessionDuration.value, comparison.avgSessionDuration.value),
        format: (value: number) => formatDuration(value)
      },
      {
        name: 'Bounce Rate',
        current: current.bounceRate.value,
        previous: comparison.bounceRate.value,
        difference: calculateDifference(current.bounceRate.value, comparison.bounceRate.value),
        format: (value: number) => formatPercentage(value)
      }
    ];
  };
  
  const comparisonMetrics = compareMetrics(currentData.data, comparisonData.data);
  
  // Date format helper
  const formatDisplayDate = (date: Date) => format(date, 'MMM d, yyyy');
  
  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-semibold">Comparison View</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Current Period</span>
            <div className="text-sm px-3 py-2 border rounded-md bg-blue-50 border-blue-200 text-blue-700">
              {formatDisplayDate(currentStartDate)} - {formatDisplayDate(currentEndDate)}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Comparison Period</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-sm justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplayDate(comparisonStartDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={comparisonStartDate}
                    onSelect={(date) => {
                      date && setComparisonStartDate(date);
                      setIsStartDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <span className="hidden sm:flex items-center">to</span>
              
              <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-sm justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplayDate(comparisonEndDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={comparisonEndDate}
                    onSelect={(date) => {
                      date && setComparisonEndDate(date);
                      setIsEndDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex gap-2 ml-auto items-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => applyPreset('previous_period')}
            >
              Previous Period
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => applyPreset('previous_year')}
            >
              Previous Year
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody>
              {currentData.isLoading || comparisonData.isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-3"><Skeleton className="h-6 w-32" /></td>
                    <td className="py-3"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3"><Skeleton className="h-6 w-20" /></td>
                  </tr>
                ))
              ) : comparisonMetrics ? (
                comparisonMetrics.map((metric, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-sm font-medium">{metric.name}</td>
                    <td className="py-3 text-sm">{metric.format(metric.current)}</td>
                    <td className="py-3 text-sm">{metric.format(metric.previous)}</td>
                    <td className="py-3 text-sm">
                      <div className={`flex items-center ${metric.difference > 0 ? 'text-secondary' : metric.difference < 0 ? 'text-accent' : 'text-gray-500'}`}>
                        {metric.difference > 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : metric.difference < 0 ? (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        ) : (
                          <Minus className="mr-1 h-3 w-3" />
                        )}
                        <span>{Math.abs(metric.difference).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No comparison data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}