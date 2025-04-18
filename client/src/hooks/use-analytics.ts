import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";

// Types based on API responses
export interface OverviewMetric {
  value: number;
  change: number;
}

export interface OverviewData {
  uniqueVisitors: OverviewMetric;
  pageViews: OverviewMetric;
  avgSessionDuration: OverviewMetric;
  bounceRate: OverviewMetric;
}

export interface VisitorTimeData {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface VisitorsOverTimeData {
  interval: 'day' | 'week' | 'month';
  data: VisitorTimeData[];
}

export interface CountryData {
  name: string;
  visitors: number;
  percentage: number;
}

export interface TrafficSourceData {
  name: string;
  visitors: number;
  icon: string;
  conversion: string;
  change: string;
}

export interface PopularPageData {
  pageUrl: string;
  pageTitle: string;
  views: number;
  avgTime: string;
  bounceRate: number;
}

export interface DeviceData {
  name: string;
  count: number;
  percentage: number;
}

// Hook to manage date range
export function useDateRange() {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default to last 7 days
    return date;
  });
  
  const [endDate, setEndDate] = useState<Date>(() => new Date());
  
  // Format dates for API requests
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
  
  // Preset date ranges
  const setLastDays = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };
  
  const dateRangeParams = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
  
  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    dateRangeParams,
    setLastDays,
    formatDate
  };
}

// Analytics data hooks
export function useOverviewData(dateRangeParams: any) {
  return useQuery<OverviewData>({
    queryKey: ['/api/analytics/overview', dateRangeParams],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
}

export function useVisitorsOverTime(dateRangeParams: any, interval: 'day' | 'week' | 'month' = 'day') {
  return useQuery<VisitorsOverTimeData>({
    queryKey: ['/api/analytics/visitors-over-time', { ...dateRangeParams, interval }],
  });
}

export function useGeographyData(dateRangeParams: any) {
  return useQuery<CountryData[]>({
    queryKey: ['/api/analytics/geography', dateRangeParams],
  });
}

export function useTrafficSources(dateRangeParams: any) {
  return useQuery<TrafficSourceData[]>({
    queryKey: ['/api/analytics/traffic-sources', dateRangeParams],
  });
}

export function usePopularPages(dateRangeParams: any, limit = 5) {
  return useQuery<PopularPageData[]>({
    queryKey: ['/api/analytics/popular-pages', { ...dateRangeParams, limit }],
  });
}

export function useDeviceData(dateRangeParams: any) {
  return useQuery<DeviceData[]>({
    queryKey: ['/api/analytics/devices', dateRangeParams],
  });
}
