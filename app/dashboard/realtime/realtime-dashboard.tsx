'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RealTimeData {
  id: string;
  type: 'order' | 'notification' | 'payment' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'completed' | 'pending';
}

export default function RealTimeDashboard() {
  const [realTimeEvents, setRealTimeEvents] = useState<RealTimeData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Simulate real-time events
  useEffect(() => {
    const mockEvents: RealTimeData[] = [
      {
        id: '1',
        type: 'order',
        title: 'New Order Received',
        description: 'Order #ORD-2024-001 from Construction Co.',
        timestamp: new Date(),
        status: 'active'
      },
      {
        id: '2',
        type: 'notification',
        title: 'Payment Processed',
        description: 'Payment of $5,000 confirmed for invoice #INV-2024-045',
        timestamp: new Date(Date.now() - 300000),
        status: 'completed'
      },
      {
        id: '3',
        type: 'message',
        title: 'New Message',
        description: 'Message from supplier: Cement delivery scheduled for tomorrow',
        timestamp: new Date(Date.now() - 600000),
        status: 'active'
      }
    ];

    // Simulate connection establishment
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setRealTimeEvents(mockEvents);
    }, 1000);

    // Simulate periodic updates
    const updateInterval = setInterval(() => {
      const newEvent: RealTimeData = {
        id: Date.now().toString(),
        type: ['order', 'notification', 'payment', 'message'][Math.floor(Math.random() * 4)] as RealTimeData['type'],
        title: 'New Event',
        description: 'Real-time update from the system',
        timestamp: new Date(),
        status: ['active', 'completed', 'pending'][Math.floor(Math.random() * 3)] as RealTimeData['status']
      };
      
      setRealTimeEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep only last 10 events
    }, 5000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(updateInterval);
    };
  }, []);

  const getEventIcon = (type: RealTimeData['type']) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'notification':
        return '🔔';
      case 'payment':
        return '💳';
      case 'message':
        return '💬';
      default:
        return '📊';
    }
  };

  const getStatusColor = (status: RealTimeData['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Real-Time Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium capitalize">{connectionStatus}</span>
        </div>
      </div>

      {!isConnected && (
        <Alert>
          <AlertDescription>
            Connecting to real-time services... Please wait.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeEvents.length}</div>
            <p className="text-xs text-muted-foreground">Active events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeEvents.filter(e => e.type === 'order').length}
            </div>
            <p className="text-xs text-muted-foreground">Order events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <span className="text-2xl">🔔</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeEvents.filter(e => e.type === 'notification').length}
            </div>
            <p className="text-xs text-muted-foreground">System notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <span className="text-2xl">💬</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeEvents.filter(e => e.type === 'message').length}
            </div>
            <p className="text-xs text-muted-foreground">Message events</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Real-Time Events</CardTitle>
          <CardDescription>Live updates from the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realTimeEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events to display. Waiting for real-time updates...
              </div>
            ) : (
              realTimeEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="text-2xl">{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{event.title}</h4>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(event.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}