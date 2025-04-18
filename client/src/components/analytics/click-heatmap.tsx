import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MousePointer, ExternalLink } from 'lucide-react';

// Demo heat map data - in a real implementation, this would come from an API
const demoHeatmapData = {
  '/': [
    { x: 30, y: 120, value: 55 }, // Logo/header
    { x: 70, y: 220, value: 120 }, // Main CTA button
    { x: 480, y: 350, value: 80 }, // Hero image
    { x: 250, y: 450, value: 65 }, // Feature section
    { x: 420, y: 520, value: 45 }, // Pricing section
    { x: 130, y: 600, value: 30 }, // Footer links
    { x: 380, y: 150, value: 25 }, // Navigation menu
    { x: 320, y: 320, value: 70 }, // Content area
    { x: 180, y: 380, value: 40 }, // Sidebar
    { x: 400, y: 420, value: 35 }, // Call to action
    // More spread out clicks
    { x: 150, y: 200, value: 15 },
    { x: 280, y: 250, value: 25 },
    { x: 350, y: 280, value: 20 },
    { x: 220, y: 320, value: 18 },
    { x: 420, y: 380, value: 22 },
    { x: 180, y: 450, value: 17 },
    { x: 300, y: 480, value: 24 },
    { x: 380, y: 550, value: 19 },
    { x: 290, y: 580, value: 16 },
    { x: 450, y: 600, value: 14 }
  ],
  '/anime': [
    { x: 50, y: 100, value: 75 }, // Search box
    { x: 150, y: 180, value: 110 }, // First anime card
    { x: 300, y: 180, value: 85 }, // Second anime card
    { x: 450, y: 180, value: 60 }, // Third anime card
    { x: 150, y: 320, value: 70 }, // Fourth anime card
    { x: 300, y: 320, value: 55 }, // Fifth anime card
    { x: 450, y: 320, value: 45 }, // Sixth anime card
    { x: 200, y: 450, value: 35 }, // Sorting options
    { x: 380, y: 500, value: 28 }, // Pagination
    { x: 290, y: 150, value: 38 }, // Filter section
    // More spread out clicks
    { x: 120, y: 240, value: 22 },
    { x: 230, y: 260, value: 18 },
    { x: 350, y: 220, value: 27 },
    { x: 420, y: 260, value: 16 },
    { x: 180, y: 350, value: 23 },
    { x: 270, y: 370, value: 19 },
    { x: 380, y: 350, value: 25 },
    { x: 450, y: 370, value: 15 },
    { x: 220, y: 420, value: 20 },
    { x: 340, y: 440, value: 17 }
  ],
  '/forum': [
    { x: 100, y: 80, value: 90 }, // New thread button
    { x: 250, y: 140, value: 120 }, // Popular thread
    { x: 350, y: 200, value: 75 }, // Second thread
    { x: 250, y: 260, value: 60 }, // Third thread
    { x: 380, y: 320, value: 50 }, // Search box
    { x: 200, y: 380, value: 45 }, // Category filter
    { x: 450, y: 150, value: 40 }, // User avatar
    { x: 150, y: 220, value: 35 }, // Sort options
    { x: 340, y: 420, value: 30 }, // Pagination
    { x: 420, y: 380, value: 28 }, // Recent posts section
    // More spread out clicks
    { x: 170, y: 160, value: 25 },
    { x: 230, y: 180, value: 20 },
    { x: 320, y: 240, value: 22 },
    { x: 280, y: 300, value: 18 },
    { x: 350, y: 340, value: 24 },
    { x: 200, y: 330, value: 19 },
    { x: 400, y: 280, value: 17 },
    { x: 270, y: 360, value: 21 },
    { x: 330, y: 380, value: 16 },
    { x: 370, y: 410, value: 14 }
  ]
};

interface ClickDataPoint {
  x: number;
  y: number;
  value: number;
}

export default function ClickHeatmap() {
  const [selectedPage, setSelectedPage] = useState('/');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Canvas size
  const canvasWidth = 600;
  const canvasHeight = 700;

  // Max and min values for scaling
  const maxValue = Math.max(...demoHeatmapData[selectedPage as keyof typeof demoHeatmapData].map(point => point.value));

  // Generate heatmap
  const generateHeatmap = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Get opacity based on click value
  const getOpacity = (value: number) => {
    return Math.min(0.85, (value / maxValue) * 0.9 + 0.1);
  };

  // Get radius based on click value
  const getRadius = (value: number) => {
    return Math.max(15, Math.min(40, (value / maxValue) * 35 + 10));
  };

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-semibold">Click Heatmap</CardTitle>
        <CardDescription>Visualize where visitors are clicking on your website</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-auto flex flex-col gap-2">
            <label className="text-sm font-medium">Page</label>
            <Select 
              value={selectedPage} 
              onValueChange={setSelectedPage}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="/">Homepage</SelectItem>
                <SelectItem value="/anime">Anime Listing</SelectItem>
                <SelectItem value="/forum">Forum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-2">
            <label className="text-sm font-medium">Device</label>
            <Select 
              value={selectedDevice} 
              onValueChange={setSelectedDevice}
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select 
              value={selectedPeriod} 
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end ml-auto">
            <Button onClick={generateHeatmap} disabled={isLoading}>
              Generate Heatmap
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-gray-50 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <div className="relative overflow-auto">
              <div className="p-4 max-w-full" style={{ height: '500px', width: `${canvasWidth}px` }}>
                {/* Website mockup background - this could be a screenshot of the actual page */}
                <div className="absolute inset-0 p-4 opacity-20">
                  {selectedPage === '/' && (
                    <div className="mock-website">
                      <div className="h-16 bg-primary/20 rounded mb-4"></div>
                      <div className="h-64 bg-gray-200 rounded mb-4"></div>
                      <div className="flex gap-4 mb-4">
                        <div className="w-1/3 h-40 bg-gray-200 rounded"></div>
                        <div className="w-1/3 h-40 bg-gray-200 rounded"></div>
                        <div className="w-1/3 h-40 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-40 bg-gray-200 rounded mb-4"></div>
                      <div className="h-20 bg-primary/20 rounded"></div>
                    </div>
                  )}
                  
                  {selectedPage === '/anime' && (
                    <div className="mock-website">
                      <div className="h-16 bg-primary/20 rounded mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded mb-4"></div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded mb-4 w-1/3 mx-auto"></div>
                      <div className="h-20 bg-primary/20 rounded"></div>
                    </div>
                  )}
                  
                  {selectedPage === '/forum' && (
                    <div className="mock-website">
                      <div className="h-16 bg-primary/20 rounded mb-4"></div>
                      <div className="flex gap-4 mb-4">
                        <div className="w-1/4 h-80 bg-gray-200 rounded"></div>
                        <div className="w-3/4 space-y-4">
                          <div className="h-16 bg-gray-200 rounded"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded mb-4 w-1/3 mx-auto"></div>
                      <div className="h-20 bg-primary/20 rounded"></div>
                    </div>
                  )}
                </div>
                
                {/* Heatmap overlay */}
                <div className="heatmap-container relative h-full w-full">
                  {demoHeatmapData[selectedPage as keyof typeof demoHeatmapData].map((point, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-red-500 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: point.x,
                        top: point.y,
                        width: getRadius(point.value) * 2,
                        height: getRadius(point.value) * 2,
                        opacity: getOpacity(point.value)
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="p-3 border-t bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MousePointer className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm text-gray-500">
                  Showing {demoHeatmapData[selectedPage as keyof typeof demoHeatmapData].length} click events
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit Page
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex gap-1 items-center">
              <div className="h-4 w-4 rounded-full bg-red-500 opacity-20"></div>
              <span className="text-xs text-gray-500">Low</span>
            </div>
            <div className="mx-4 flex-1 h-2 bg-gradient-to-r from-red-500/20 to-red-500/90 rounded-full w-24"></div>
            <div className="flex gap-1 items-center">
              <div className="h-4 w-4 rounded-full bg-red-500 opacity-90"></div>
              <span className="text-xs text-gray-500">High</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Click volume based on {selectedPeriod === '7d' ? 'last 7 days' : selectedPeriod === '30d' ? 'last 30 days' : 'last 90 days'} of data
          </div>
        </div>
      </CardContent>
    </Card>
  );
}