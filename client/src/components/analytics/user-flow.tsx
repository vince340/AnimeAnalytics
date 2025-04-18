import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Users, ExternalLink, Download } from 'lucide-react';

// Demo user flow data - in a real implementation, this would come from an API
const demoUserFlowData: {
  entry: Record<string, number>;
  flows: Array<{from: string; to: string; value: number}>;
  exits: Record<string, number>;
} = {
  entry: {
    '/': 60,
    '/anime': 25,
    '/forum': 10,
    '/about': 5
  },
  flows: [
    { from: '/', to: '/anime', value: 35 },
    { from: '/', to: '/forum', value: 12 },
    { from: '/', to: '/about', value: 8 },
    { from: '/anime', to: '/anime/details', value: 18 },
    { from: '/anime', to: '/', value: 5 },
    { from: '/anime', to: '/forum', value: 2 },
    { from: '/forum', to: '/anime', value: 6 },
    { from: '/forum', to: '/', value: 4 },
    { from: '/about', to: '/', value: 3 },
    { from: '/about', to: '/contact', value: 2 },
    { from: '/anime/details', to: '/anime', value: 10 },
    { from: '/anime/details', to: '/forum', value: 5 },
    { from: '/anime/details', to: '/', value: 3 }
  ],
  exits: {
    '/': 15,
    '/anime': 2,
    '/forum': 1,
    '/about': 1,
    '/anime/details': 10,
    '/contact': 1
  }
};

// Interface for a node in the flow diagram
interface FlowNode {
  id: string;
  label: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Interface for a connection between nodes
interface FlowConnection {
  from: string;
  to: string;
  value: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export default function UserFlow() {
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedEntryPoint, setSelectedEntryPoint] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Generate user flow visualization
  const generateUserFlow = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Create flow nodes
  const createFlowNodes = (): FlowNode[] => {
    const nodes: FlowNode[] = [];
    const pageNames: Record<string, string> = {
      '/': 'Homepage',
      '/anime': 'Anime Listing',
      '/forum': 'Forum',
      '/about': 'About Us',
      '/anime/details': 'Anime Details',
      '/contact': 'Contact'
    };
    
    // Entry node
    nodes.push({
      id: 'entry',
      label: 'Entry Points',
      value: 100,
      x: 50,
      y: 300,
      width: 150,
      height: 80
    });
    
    // Page nodes for first step
    let i = 0;
    for (const page in demoUserFlowData.entry) {
      if (demoUserFlowData.entry.hasOwnProperty(page)) {
        nodes.push({
          id: `first_${page}`,
          label: pageNames[page] || page,
          value: demoUserFlowData.entry[page],
          x: 300,
          y: 120 + i * 150,
          width: 130,
          height: 70
        });
        i++;
      }
    }
    
    // Page nodes for second step
    const secondStepPages = [...new Set(demoUserFlowData.flows.map(flow => flow.to))];
    secondStepPages.forEach((page, i) => {
      // Skip if the page was already in the first step
      if (!nodes.some(node => node.id === `first_${page}`)) {
        nodes.push({
          id: `second_${page}`,
          label: pageNames[page] || page,
          value: demoUserFlowData.flows.filter(flow => flow.to === page)
                 .reduce((sum, flow) => sum + flow.value, 0),
          x: 550,
          y: 120 + i * 150,
          width: 130,
          height: 70
        });
      }
    });
    
    // Exit node
    nodes.push({
      id: 'exit',
      label: 'Exit',
      value: Object.values(demoUserFlowData.exits).reduce((sum, val) => sum + val, 0),
      x: 800,
      y: 300,
      width: 150,
      height: 80
    });
    
    return nodes;
  };

  // Create flow connections
  const createFlowConnections = (nodes: FlowNode[]): FlowConnection[] => {
    const connections: FlowConnection[] = [];
    
    // Connections from entry to first step
    for (const page in demoUserFlowData.entry) {
      if (demoUserFlowData.entry.hasOwnProperty(page)) {
        const targetNode = nodes.find(node => node.id === `first_${page}`);
        if (targetNode) {
          connections.push({
            from: 'entry',
            to: `first_${page}`,
            value: demoUserFlowData.entry[page],
            fromX: 200,
            fromY: 300,
            toX: targetNode.x,
            toY: targetNode.y + targetNode.height / 2
          });
        }
      }
    }
    
    // Connections between pages
    demoUserFlowData.flows.forEach(flow => {
      const sourceNode = nodes.find(node => node.id === `first_${flow.from}`);
      let targetNode = nodes.find(node => node.id === `second_${flow.to}`);
      
      // If there's no second step node, check for a first step node
      if (!targetNode) {
        targetNode = nodes.find(node => node.id === `first_${flow.to}`);
      }
      
      if (sourceNode && targetNode) {
        connections.push({
          from: sourceNode.id,
          to: targetNode.id,
          value: flow.value,
          fromX: sourceNode.x + sourceNode.width,
          fromY: sourceNode.y + sourceNode.height / 2,
          toX: targetNode.x,
          toY: targetNode.y + targetNode.height / 2
        });
      }
    });
    
    // Connections to exit
    for (const page in demoUserFlowData.exits) {
      if (demoUserFlowData.exits.hasOwnProperty(page)) {
        const sourceNode = nodes.find(node => 
          node.id === `first_${page}` || node.id === `second_${page}`
        );
        
        if (sourceNode) {
          connections.push({
            from: sourceNode.id,
            to: 'exit',
            value: demoUserFlowData.exits[page],
            fromX: sourceNode.x + sourceNode.width,
            fromY: sourceNode.y + sourceNode.height / 2,
            toX: 800,
            toY: 300
          });
        }
      }
    }
    
    return connections;
  };

  // Get flow nodes and connections
  const flowNodes = createFlowNodes();
  const flowConnections = createFlowConnections(flowNodes);

  // Helper to calculate path for connections
  const createConnectionPath = (connection: FlowConnection): string => {
    const { fromX, fromY, toX, toY, value } = connection;
    
    // Calculate control points for the curve
    const midX = (fromX + toX) / 2;
    
    // Create curved path
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
  };

  // Get scaled stroke width based on value
  const getConnectionWidth = (value: number): number => {
    const maxValue = Math.max(...flowConnections.map(conn => conn.value));
    return Math.max(2, Math.min(10, (value / maxValue) * 8 + 2));
  };

  // Get node color based on type
  const getNodeColor = (nodeId: string): string => {
    if (nodeId === 'entry') return 'rgba(74, 144, 226, 0.7)';
    if (nodeId === 'exit') return 'rgba(255, 107, 107, 0.7)';
    return 'rgba(52, 199, 89, 0.7)';
  };

  // Get node border color
  const getNodeBorderColor = (nodeId: string): string => {
    if (nodeId === 'entry') return 'rgb(74, 144, 226)';
    if (nodeId === 'exit') return 'rgb(255, 107, 107)';
    return 'rgb(52, 199, 89)';
  };

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-semibold">User Flow Analysis</CardTitle>
        <CardDescription>Visualize how users navigate through your website</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
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
          
          <div className="w-full md:w-auto flex flex-col gap-2">
            <label className="text-sm font-medium">Entry Point</label>
            <Select 
              value={selectedEntryPoint} 
              onValueChange={setSelectedEntryPoint}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select entry point" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entry Points</SelectItem>
                <SelectItem value="/">Homepage</SelectItem>
                <SelectItem value="/anime">Anime Listing</SelectItem>
                <SelectItem value="/forum">Forum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end ml-auto">
            <Button onClick={generateUserFlow} disabled={isLoading} className="mr-2">
              Generate Flow
            </Button>
            <Button variant="outline" disabled={isLoading}>
              <Download className="h-4 w-4 mr-1" />
              Export
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
              <svg width="1000" height="600" className="user-flow-diagram">
                {/* Flow connections */}
                {flowConnections.map((connection, i) => (
                  <g key={`conn-${i}`}>
                    <path
                      d={createConnectionPath(connection)}
                      fill="none"
                      stroke="rgba(156, 163, 175, 0.5)"
                      strokeWidth={getConnectionWidth(connection.value)}
                      strokeLinecap="round"
                    />
                    {/* Flow value indicator */}
                    <g transform={`translate(${(connection.fromX + connection.toX) / 2 - 10}, ${(connection.fromY + connection.toY) / 2 - 10})`}>
                      <circle cx="10" cy="10" r="10" fill="white" stroke="#E5E7EB" />
                      <text x="10" y="14" textAnchor="middle" fontSize="10" fill="#4B5563">
                        {connection.value}
                      </text>
                    </g>
                  </g>
                ))}
                
                {/* Flow nodes */}
                {flowNodes.map(node => (
                  <g key={`node-${node.id}`}>
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.width}
                      height={node.height}
                      rx="8"
                      ry="8"
                      fill={getNodeColor(node.id)}
                      stroke={getNodeBorderColor(node.id)}
                      strokeWidth="2"
                    />
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 - 5}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill="#1F2937"
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 + 15}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#4B5563"
                    >
                      {node.value}%
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
          
          <div className="p-3 border-t bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm text-gray-500">
                  Showing user flow pathways with session volume
                </span>
              </div>
              <div className="flex">
                <div className="flex items-center mr-4">
                  <div className="h-3 w-3 rounded-full bg-[rgba(74,144,226,0.7)] mr-1 border border-[rgb(74,144,226)]"></div>
                  <span className="text-xs text-gray-500">Entry</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="h-3 w-3 rounded-full bg-[rgba(52,199,89,0.7)] mr-1 border border-[rgb(52,199,89)]"></div>
                  <span className="text-xs text-gray-500">Page</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[rgba(255,107,107,0.7)] mr-1 border border-[rgb(255,107,107)]"></div>
                  <span className="text-xs text-gray-500">Exit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Values shown are percentages of total sessions. Thicker connections indicate more frequent user paths.</p>
        </div>
      </CardContent>
    </Card>
  );
}