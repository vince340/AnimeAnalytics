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
import ComparisonView from '@/components/analytics/comparison-view';
import AlertsCenter from '@/components/analytics/alerts-center';
import ClickHeatmap from '@/components/analytics/click-heatmap';
import UserFlow from '@/components/analytics/user-flow';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportOverviewData,
  exportVisitorsData,
  exportGeographyData,
  exportTrafficSourcesData,
  exportPagesData,
  exportDeviceData,
  exportFullReport
} from '@/utils/export-utils';

export default function Dashboard() {
  // State for chart interval
  const [chartInterval, setChartInterval] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState('overview');
  
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
  const handleExport = (exportType: string) => {
    switch (exportType) {
      case 'overview':
        if (overviewData.data) {
          exportOverviewData(overviewData.data, startDate, endDate);
        }
        break;
      case 'visitors':
        if (visitorsData.data) {
          exportVisitorsData(visitorsData.data, startDate, endDate);
        }
        break;
      case 'geography':
        if (geographyData.data) {
          exportGeographyData(geographyData.data, startDate, endDate);
        }
        break;
      case 'traffic':
        if (trafficSourcesData.data) {
          exportTrafficSourcesData(trafficSourcesData.data, startDate, endDate);
        }
        break;
      case 'pages':
        if (popularPagesData.data) {
          exportPagesData(popularPagesData.data, startDate, endDate);
        }
        break;
      case 'devices':
        if (deviceData.data) {
          exportDeviceData(deviceData.data, startDate, endDate);
        }
        break;
      case 'full':
        if (overviewData.data && visitorsData.data && geographyData.data && 
            trafficSourcesData.data && popularPagesData.data && deviceData.data) {
          exportFullReport(
            overviewData.data,
            visitorsData.data,
            geographyData.data,
            trafficSourcesData.data,
            popularPagesData.data,
            deviceData.data,
            startDate,
            endDate
          );
        }
        break;
      default:
        alert('Select a specific export type');
    }
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Download size={16} />
                  Export
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('overview')}>
                  Overview Metrics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('visitors')}>
                  Visitors Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('geography')}>
                  Geography Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('traffic')}>
                  Traffic Sources
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pages')}>
                  Popular Pages
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('devices')}>
                  Device Breakdown
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('full')}>
                  Full Report (All Data)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main tabs for different dashboard sections */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full justify-start border-b pb-px mb-4">
            <TabsTrigger value="overview" className="mr-2">Overview</TabsTrigger>
            <TabsTrigger value="behavior" className="mr-2">User Behavior</TabsTrigger>
            <TabsTrigger value="comparison" className="mr-2">Comparison</TabsTrigger>
            <TabsTrigger value="alerts" className="mr-2">Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
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
          </TabsContent>
          
          <TabsContent value="behavior">
            {/* User Flow Analysis */}
            <UserFlow />
            
            {/* Click Heatmap */}
            <ClickHeatmap />
          </TabsContent>
          
          <TabsContent value="comparison">
            {/* Period Comparison */}
            <ComparisonView 
              currentStartDate={startDate}
              currentEndDate={endDate}
            />
            
            {/* Keep some basic metrics in the comparison view too */}
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
          </TabsContent>
          
          <TabsContent value="alerts">
            {/* Alerts Center */}
            <AlertsCenter />
            
            {/* Keep a condensed overview so users can monitor main metrics */}
            <OverviewMetrics 
              data={overviewData.data} 
              isLoading={overviewData.isLoading} 
            />
          </TabsContent>
        </Tabs>
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
