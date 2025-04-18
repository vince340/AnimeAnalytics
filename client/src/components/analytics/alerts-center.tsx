import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BellRing,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Check,
  X,
  Trash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Alert types
type AlertType = 'traffic_spike' | 'traffic_drop' | 'high_bounce' | 'long_session';

interface Alert {
  id: string;
  type: AlertType;
  threshold: number;
  enabled: boolean;
  createdAt: Date;
  channels: {
    email: boolean;
    push: boolean;
    slack: boolean;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  timestamp: Date;
  read: boolean;
}

// Demo alerts
const defaultAlerts: Alert[] = [
  {
    id: '1',
    type: 'traffic_spike',
    threshold: 30,
    enabled: true,
    createdAt: new Date(),
    channels: {
      email: true,
      push: true,
      slack: false
    }
  },
  {
    id: '2',
    type: 'traffic_drop',
    threshold: 25,
    enabled: true,
    createdAt: new Date(),
    channels: {
      email: true,
      push: false,
      slack: false
    }
  },
  {
    id: '3',
    type: 'high_bounce',
    threshold: 75,
    enabled: false,
    createdAt: new Date(),
    channels: {
      email: true,
      push: true,
      slack: true
    }
  }
];

// Demo notifications
const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'Traffic Spike Detected',
    message: 'Your website traffic increased by 35% in the last hour',
    type: 'traffic_spike',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false
  },
  {
    id: '2',
    title: 'High Bounce Rate Alert',
    message: 'Your homepage bounce rate has exceeded 80% in the last 24 hours',
    type: 'high_bounce',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: false
  },
  {
    id: '3',
    title: 'Traffic Drop Detected',
    message: 'Your website traffic decreased by 28% compared to the same time last week',
    type: 'traffic_drop',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true
  }
];

export default function AlertsCenter() {
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [activeTab, setActiveTab] = useState('notifications');
  const [newAlertType, setNewAlertType] = useState<AlertType>('traffic_spike');
  const [newAlertThreshold, setNewAlertThreshold] = useState(30);
  const { toast } = useToast();

  // Format the timestamp for display
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  // Get icon for alert type
  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'traffic_spike':
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case 'traffic_drop':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'high_bounce':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'long_session':
        return <Clock className="h-5 w-5 text-indigo-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get readable name for alert type
  const getAlertTypeName = (type: AlertType): string => {
    switch (type) {
      case 'traffic_spike':
        return 'Traffic Spike';
      case 'traffic_drop':
        return 'Traffic Drop';
      case 'high_bounce':
        return 'High Bounce Rate';
      case 'long_session':
        return 'Long Session Duration';
      default:
        return 'Unknown Alert';
    }
  };

  // Toggle alert enabled status
  const toggleAlertStatus = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  // Delete an alert
  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert deleted",
      description: "The alert has been removed",
    });
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared",
    });
  };

  // Create a new alert
  const createAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: newAlertType,
      threshold: newAlertThreshold,
      enabled: true,
      createdAt: new Date(),
      channels: {
        email: true,
        push: false,
        slack: false
      }
    };
    
    setAlerts([...alerts, newAlert]);
    toast({
      title: "Alert created",
      description: `New ${getAlertTypeName(newAlertType)} alert has been created`,
    });
  };

  // Get threshold description based on alert type
  const getThresholdDescription = (type: AlertType): string => {
    switch (type) {
      case 'traffic_spike':
      case 'traffic_drop':
        return '% change';
      case 'high_bounce':
        return '% rate';
      case 'long_session':
        return 'minutes';
      default:
        return '%';
    }
  };

  return (
    <Card className="bg-white shadow-sm mb-6">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Alerts & Notifications</CardTitle>
            <CardDescription>Manage your alerts and view notifications</CardDescription>
          </div>
          <div className="flex items-center">
            {activeTab === 'notifications' && notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="create">Create Alert</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BellRing className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No notifications to display</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border flex items-start ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
                  >
                    <div className="mr-3 mt-1">
                      {getAlertIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className={`text-sm font-semibold ${notification.read ? 'text-gray-800' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="ml-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="alerts">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No alerts configured</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('create')}
                  >
                    Create your first alert
                  </Button>
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-lg border bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">
                            {getAlertTypeName(alert.type)}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Threshold: {alert.threshold}{getThresholdDescription(alert.type)}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <span className={`text-xs ${alert.channels.email ? 'text-blue-600' : 'text-gray-400'}`}>Email</span>
                              {alert.channels.email ? <Check className="h-3 w-3 text-blue-600" /> : <X className="h-3 w-3 text-gray-400" />}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs ${alert.channels.push ? 'text-blue-600' : 'text-gray-400'}`}>Push</span>
                              {alert.channels.push ? <Check className="h-3 w-3 text-blue-600" /> : <X className="h-3 w-3 text-gray-400" />}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs ${alert.channels.slack ? 'text-blue-600' : 'text-gray-400'}`}>Slack</span>
                              {alert.channels.slack ? <Check className="h-3 w-3 text-blue-600" /> : <X className="h-3 w-3 text-gray-400" />}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Switch 
                          checked={alert.enabled} 
                          onCheckedChange={() => toggleAlertStatus(alert.id)} 
                          className="mr-2"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="create">
            <div className="space-y-4">
              <div>
                <Label htmlFor="alert-type">Alert Type</Label>
                <select 
                  id="alert-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newAlertType}
                  onChange={(e) => setNewAlertType(e.target.value as AlertType)}
                >
                  <option value="traffic_spike">Traffic Spike</option>
                  <option value="traffic_drop">Traffic Drop</option>
                  <option value="high_bounce">High Bounce Rate</option>
                  <option value="long_session">Long Session Duration</option>
                </select>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="threshold">Threshold: {newAlertThreshold}{getThresholdDescription(newAlertType)}</Label>
                </div>
                <Slider
                  id="threshold"
                  min={1}
                  max={100}
                  step={1}
                  value={[newAlertThreshold]}
                  onValueChange={(value) => setNewAlertThreshold(value[0])}
                  className="py-4"
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab('alerts')}>
                  Cancel
                </Button>
                <Button onClick={createAlert}>
                  Create Alert
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}