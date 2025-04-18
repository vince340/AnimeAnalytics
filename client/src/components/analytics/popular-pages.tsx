import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PopularPageData } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface PopularPagesProps {
  data?: PopularPageData[];
  isLoading: boolean;
}

export default function PopularPages({ data, isLoading }: PopularPagesProps) {
  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Popular Pages</CardTitle>
        <Button variant="link" className="text-primary text-sm p-0 h-auto">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-3"><Skeleton className="h-6 w-40" /></td>
                    <td className="py-3"><Skeleton className="h-6 w-16" /></td>
                    <td className="py-3"><Skeleton className="h-6 w-16" /></td>
                    <td className="py-3"><Skeleton className="h-6 w-16" /></td>
                  </tr>
                ))
              ) : data && data.length > 0 ? (
                data.map((page, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <span className="text-primary font-medium">{page.pageUrl}</span>
                        <span className="ml-2 text-gray-500 text-xs">{page.pageTitle}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{page.views.toLocaleString()}</td>
                    <td className="py-3 text-sm">{page.avgTime}</td>
                    <td className="py-3 text-sm">{page.bounceRate.toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No page data available
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
