import { format, formatDistance } from 'date-fns';

// Format a duration in seconds to a readable string (e.g. 2m 45s)
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}m ${remainingSeconds}s`;
}

// Get a human-readable date range description
export function getDateRangeDescription(startDate: Date, endDate: Date): string {
  const now = new Date();
  
  // Check if it's one of the standard ranges
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Last 7 days
  if (daysDiff === 6 && isSameDay(endDate, now)) {
    return 'Last 7 days';
  }
  
  // Last 30 days
  if (daysDiff === 29 && isSameDay(endDate, now)) {
    return 'Last 30 days';
  }
  
  // Last 90 days
  if (daysDiff === 89 && isSameDay(endDate, now)) {
    return 'Last 90 days';
  }
  
  // Custom range
  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
}

// Check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Format a percentage value
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Format a large number with k/m suffix
export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}m`;
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  
  return value.toString();
}

// Get the appropriate change indicator (positive or negative)
export function getChangeIndicator(change: number): {
  color: string;
  icon: string;
} {
  if (change > 0) {
    return {
      color: 'text-secondary', // green
      icon: 'arrow-up'
    };
  }
  
  if (change < 0) {
    return {
      color: 'text-accent', // red
      icon: 'arrow-down'
    };
  }
  
  return {
    color: 'text-gray-500',
    icon: 'minus'
  };
}
