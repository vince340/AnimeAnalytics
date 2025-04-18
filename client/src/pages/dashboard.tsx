import React, { useState } from 'react';
import { 
  useOverviewData, 
  useVisitorsOverTime, 
  useGeographyData, 
  useTrafficSources, 
  usePopularPages, 
  useDeviceData,
  useDateRange 
} from '@/hooks/use-analytics';
import OverviewMetrics from '@/components/analytics/overview-metrics';
import VisitorsChart from '@/components/analytics/visitors-chart';
import GeographyMap from '@/components/analytics/geography-map';
import TrafficSources from '@/components/analytics/traffic-sources';
import PopularPages from '@/components/analytics/popular-pages';
import DeviceMetrics from '@/components/analytics/device-metrics';
import DateRangePicker from '@/components/analytics/date-range-picker';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Dashboard() {
  // State for chart interval
  const [chartInterval, setChartInterval] = useState<'day' | 'week' | 'month'>('week');
  
  // Get date range from the custom hook
  const { 
    startDate, 
    endDate, 
    dateRangeParams, 
    setStartDate, 
    setEndDate 
  } = useDateRange();
  
  // Fetch analytics data with react-query
  const overviewData = useOverviewData(dateRangeParams);
  const visitorsData = useVisitorsOverTime(dateRangeParams, chartInterval);
  const geographyData = useGeographyData(dateRangeParams);
  const trafficSourcesData = useTrafficSources(dateRangeParams);
  const popularPagesData = usePopularPages(dateRangeParams);
  const deviceData = useDeviceData(dateRangeParams);
  
  // Handle date range changes
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  // Handle exporting data
  const handleExport = () => {
    // This would handle exporting the data to a CSV or other format
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded bg-primary flex items-center justify-center text-white font-bold">
              AF
            </div>
            <div>
              <h1 className="text-lg font-semibold">Anime Focus Analytics</h1>
              <p className="text-sm text-gray-500">anime-focus-v2.vercel.app</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DateRangePicker 
              startDate={startDate}
              endDate={endDate}
              onRangeChange={handleDateRangeChange}
            />
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview metrics */}
        <OverviewMetrics 
          data={overviewData.data} 
          isLoading={overviewData.isLoading} 
        />
        
        {/* Visitors chart */}
        <VisitorsChart 
          data={visitorsData.data} 
          isLoading={visitorsData.isLoading}
          interval={chartInterval}
          onIntervalChange={setChartInterval}
        />
        
        {/* Two-column layout for Geography and Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GeographyMap 
            data={geographyData.data} 
            isLoading={geographyData.isLoading} 
          />
          <TrafficSources 
            data={trafficSourcesData.data} 
            isLoading={trafficSourcesData.isLoading} 
          />
        </div>
        
        {/* Three-column layout for Popular Pages and Device Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PopularPages 
              data={popularPagesData.data} 
              isLoading={popularPagesData.isLoading} 
            />
          </div>
          <DeviceMetrics 
            data={deviceData.data} 
            isLoading={deviceData.isLoading} 
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2023 Anime Focus Analytics. All rights reserved.</p>
            <div className="flex space-x-4 mt-3 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-primary">Documentation</a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
