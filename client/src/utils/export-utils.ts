import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import {
  OverviewData,
  VisitorsOverTimeData,
  CountryData,
  TrafficSourceData,
  PopularPageData,
  DeviceData
} from '@/hooks/use-analytics';

// Helper to convert date to readable string for filenames
const formatDateForFilename = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Convert JSON data to CSV string
const jsonToCSV = (data: any[], columns: string[]): string => {
  // Create header row
  let csvContent = columns.join(',') + '\n';

  // Add data rows
  data.forEach(item => {
    const row = columns.map(column => {
      // Handle nested properties
      const value = column.includes('.')
        ? column.split('.').reduce((obj, key) => obj && obj[key], item)
        : item[column];
      
      // Format and escape the value
      let formattedValue = value === null || value === undefined ? '' : String(value);
      
      // Escape quotes and wrap in quotes if the value contains commas or quotes
      if (formattedValue.includes(',') || formattedValue.includes('"')) {
        formattedValue = '"' + formattedValue.replace(/"/g, '""') + '"';
      }
      
      return formattedValue;
    }).join(',');
    
    csvContent += row + '\n';
  });
  
  return csvContent;
};

// Export overview metrics
export const exportOverviewData = (data: OverviewData, startDate: Date, endDate: Date): void => {
  const filename = `anime-focus-overview-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}.csv`;
  
  const csvData = [
    {
      metric: 'Unique Visitors', 
      value: data.uniqueVisitors.value, 
      change: `${data.uniqueVisitors.change.toFixed(1)}%`
    },
    {
      metric: 'Page Views', 
      value: data.pageViews.value, 
      change: `${data.pageViews.change.toFixed(1)}%`
    },
    {
      metric: 'Avg Session Duration', 
      value: data.avgSessionDuration.value, 
      change: `${data.avgSessionDuration.change.toFixed(1)}%`
    },
    {
      metric: 'Bounce Rate', 
      value: `${data.bounceRate.value.toFixed(1)}%`, 
      change: `${data.bounceRate.change.toFixed(1)}%`
    }
  ];
  
  const csvContent = jsonToCSV(csvData, ['metric', 'value', 'change']);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
};

// Export visitors over time
export const exportVisitorsData = (data: VisitorsOverTimeData, startDate: Date, endDate: Date): void => {
  const filename = `anime-focus-visitors-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}.csv`;
  
  const csvContent = jsonToCSV(data.data, ['date', 'visitors', 'pageViews']);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
};

// Export geography data
export const exportGeographyData = (data: CountryData[], startDate: Date, endDate: Date): void => {
  const filename = `anime-focus-geography-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}.csv`;
  
  const csvContent = jsonToCSV(data, ['name', 'visitors', 'percentage']);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
};

// Export traffic sources
export const exportTrafficSourcesData = (data: TrafficSourceData[], startDate: Date, endDate: Date): void => {
  const filename = `anime-focus-traffic-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}.csv`;
  
  const csvContent = jsonToCSV(data, ['name', 'visitors', 'conversion', 'change']);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
};

// Export popular pages
export const exportPagesData = (data: PopularPageData[], startDate: Date, endDate: Date): void => {
  const filename = `anime-focus-pages-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}.csv`;
  
  const csvContent = jsonToCSV(data, ['pageUrl', 'pageTitle', 'views', 'avgTime', 'bounceRate']);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
};

// Export device breakdown
export const exportDeviceData = (data: DeviceData[], startDate: Date, endDate: Date): void => {
  const filename = `anime-focus-devices-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}.csv`;
  
  const csvContent = jsonToCSV(data, ['name', 'count', 'percentage']);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
};

// Export all data as a comprehensive report
export const exportFullReport = (
  overview: OverviewData,
  visitors: VisitorsOverTimeData,
  geography: CountryData[],
  traffic: TrafficSourceData[],
  pages: PopularPageData[],
  devices: DeviceData[],
  startDate: Date,
  endDate: Date
): void => {
  const filename = `anime-focus-full-report-${formatDateForFilename(startDate)}-to-${formatDateForFilename(endDate)}.zip`;
  
  // In a real implementation, we would use a library like JSZip to create a zip file
  // containing all the individual CSV files
  alert('Full report export would generate a ZIP file with all metrics in CSV format');
  
  // For now, let's export the overview as a demonstration
  exportOverviewData(overview, startDate, endDate);
};