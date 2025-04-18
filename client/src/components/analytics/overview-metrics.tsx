import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Eye, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { OverviewData } from '@/hooks/use-analytics';
import { formatDuration, formatPercentage, getChangeIndicator } from '@/utils/date-utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OverviewMetricsProps {
  data?: OverviewData;
  isLoading: boolean;
}

export default function OverviewMetrics({ data, isLoading }: OverviewMetricsProps) {
  const metrics = [
    {
      label: 'Unique Visitors',
      value: data?.uniqueVisitors.value,
      change: data?.uniqueVisitors.change,
      icon: <Users className="h-4 w-4 text-primary/80" />,
      format: (value: number) => value.toLocaleString()
    },
    {
      label: 'Total Page Views',
      value: data?.pageViews.value,
      change: data?.pageViews.change,
      icon: <Eye className="h-4 w-4 text-primary/80" />,
      format: (value: number) => value.toLocaleString()
    },
    {
      label: 'Avg. Session Duration',
      value: data?.avgSessionDuration.value,
      change: data?.avgSessionDuration.change,
      icon: <Clock className="h-4 w-4 text-primary/80" />,
      format: (value: number) => formatDuration(value)
    },
    {
      label: 'Bounce Rate',
      value: data?.bounceRate.value,
      change: data?.bounceRate.change,
      icon: <ArrowDown className="h-4 w-4 text-primary/80" />,
      format: (value: number) => formatPercentage(value)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              {metric.icon}
              <p className="text-sm text-gray-500 font-medium">{metric.label}</p>
            </div>
            <div className="flex items-end justify-between">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-semibold">
                  {metric.value !== undefined ? metric.format(metric.value) : '-'}
                </p>
              )}
              
              {isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                metric.change !== undefined && (
                  <div className={`flex items-center text-sm ${getChangeIndicator(metric.change).color}`}>
                    {metric.change > 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : metric.change < 0 ? (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    ) : (
                      <Minus className="mr-1 h-3 w-3" />
                    )}
                    <span>{Math.abs(metric.change).toFixed(1)}%</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
