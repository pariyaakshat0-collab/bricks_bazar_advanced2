"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Check, Filter, Search, RefreshCw, Settings, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error' | 'ai_insight' | 'system'
  category: 'order' | 'delivery' | 'inventory' | 'price' | 'ai' | 'system' | 'route'
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionUrl?: string
  actionText?: string
  userId?: string
  avatar?: string
  senderName?: string
  relatedId?: string
  relatedType?: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  aiInsights: boolean
  orderUpdates: boolean
  deliveryUpdates: boolean
  priceAlerts: boolean
  inventoryAlerts: boolean
  systemAlerts: boolean
  routeOptimization: boolean
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "AI Route Optimization Complete",
      message: "Your delivery routes have been optimized, saving 2.5 hours and $45 in fuel costs. New route includes 3 stops with optimal sequencing.",
      type: "ai_insight",
      category: "route",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: "high",
      actionUrl: "/dashboard/distributor?tool=route-optimizer",
      actionText: "View Optimized Routes",
      relatedId: "route_001",
      relatedType: "route_optimization"
    },
    {
      id: "2",
      title: "Inventory Alert - Steel Beams Low",
      message: "Steel beams inventory has dropped below safety stock level. Current stock: 45 units, Recommended: 200 units. Reorder recommended within 48 hours.",
      type: "warning",
      category: "inventory",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      priority: "urgent",
      actionUrl: "/dashboard/seller?tool=inventory-optimizer",
      actionText: "Restock Now",
      relatedId: "steel_beams_001",
      relatedType: "inventory_item"
    },
    {
      id: "3",
      title: "Price Drop Alert - Concrete",
      message: "Concrete prices have dropped by 8% in your area. Current price: $95/cubic yard, Average market price: $103/cubic yard. Great buying opportunity!",
      type: "info",
      category: "price",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      priority: "medium",
      actionUrl: "/dashboard/buyer?tool=price-comparison",
      actionText: "Compare Prices",
      relatedId: "concrete_price_001",
      relatedType: "price_alert"
    },
    {
      id: "4",
      title: "Delivery Completed - Order #12345",
      message: "Your delivery of 500 concrete blocks to Downtown Construction Site has been completed successfully. Customer rating: 4.8/5.",
      type: "success",
      category: "delivery",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      priority: "low",
      actionUrl: "/dashboard/distributor?tool=delivery-tracker",
      actionText: "View Details",
      relatedId: "order_12345",
      relatedType: "delivery"
    },
    {
      id: "5",
      title: "AI Insight - Weather Impact",
      message: "Weather forecast shows heavy rain for the next 3 days in your delivery areas. Consider rescheduling non-urgent deliveries to maintain safety standards.",
      type: "ai_insight",
      category: "ai",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
      priority: "high",
      actionUrl: "/dashboard/distributor?tool=route-optimizer",
      actionText: "Reschedule Routes",
      relatedId: "weather_alert_001",
      relatedType: "weather_forecast"
    },
    {
      id: "6",
      title: "New Order - Large Construction Project",
      message: "New bulk order received: 2,000 steel beams, 500 cubic yards concrete, 10,000 bricks. Total value: $125,000. Customer: MegaBuild Corp.",
      type: "info",
      category: "order",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      priority: "high",
      actionUrl: "/dashboard/seller?tab=orders",
      actionText: "Review Order",
      relatedId: "order_67890",
      relatedType: "new_order"
    }
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    aiInsights: true,
    orderUpdates: true,
    deliveryUpdates: true,
    priceAlerts: true,
    inventoryAlerts: true,
    systemAlerts: true,
    routeOptimization: true
  })

  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const unreadCount = notifications.filter(n => !n.read).length
  const highPriorityCount = notifications.filter(n => n.priority === "urgent" && !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "ai_insight":
        return <RefreshCw className="h-5 w-5 text-purple-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "order":
        return "bg-blue-100 text-blue-800"
      case "delivery":
        return "bg-green-100 text-green-800"
      case "inventory":
        return "bg-purple-100 text-purple-800"
      case "price":
        return "bg-yellow-100 text-yellow-800"
      case "ai":
        return "bg-indigo-100 text-indigo-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      case "route":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const filteredNotifications = notifications.filter(notification => {
    if (showUnreadOnly && notification.read) return false
    if (filterType !== "all" && notification.type !== filterType) return false
    if (filterCategory !== "all" && notification.category !== filterCategory) return false
    if (filterPriority !== "all" && notification.priority !== filterPriority) return false
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const refreshNotifications = () => {
    // Simulate fetching new notifications
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: "New AI Recommendation",
      message: "Based on recent market trends, we recommend purchasing steel beams within the next 48 hours for optimal pricing.",
      type: "ai_insight",
      category: "ai",
      timestamp: new Date(),
      read: false,
      priority: "medium",
      actionUrl: "/dashboard/buyer?tool=price-comparison",
      actionText: "View Analysis"
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
            <p className="text-gray-600 mt-1">Stay updated with your platform activities</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="destructive" className={highPriorityCount > 0 ? "animate-pulse" : ""}>
              {highPriorityCount} Urgent
            </Badge>
            <Badge variant="secondary">
              {unreadCount} Unread
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="ai_insight">AI Insights</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="delivery">Deliveries</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="price">Prices</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="route">Routes</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unread-only"
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                  />
                  <Label htmlFor="unread-only" className="text-sm">Unread only</Label>
                </div>

                <Button variant="outline" size="sm" onClick={refreshNotifications}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>

                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Notification Settings</DialogTitle>
                      <DialogDescription>
                        Configure your notification preferences
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="font-medium">Delivery Methods</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email" className="text-sm">Email Notifications</Label>
                            <Switch
                              id="email"
                              checked={settings.email}
                              onCheckedChange={(checked) => updateSettings('email', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push" className="text-sm">Push Notifications</Label>
                            <Switch
                              id="push"
                              checked={settings.push}
                              onCheckedChange={(checked) => updateSettings('push', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="sms" className="text-sm">SMS Alerts</Label>
                            <Switch
                              id="sms"
                              checked={settings.sms}
                              onCheckedChange={(checked) => updateSettings('sms', checked)}
                            />
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="font-medium">Notification Types</Label>
                        <div className="space-y-2">
                          {[
                            { key: 'aiInsights', label: 'AI Insights' },
                            { key: 'orderUpdates', label: 'Order Updates' },
                            { key: 'deliveryUpdates', label: 'Delivery Updates' },
                            { key: 'priceAlerts', label: 'Price Alerts' },
                            { key: 'inventoryAlerts', label: 'Inventory Alerts' },
                            { key: 'routeOptimization', label: 'Route Optimization' },
                            { key: 'systemAlerts', label: 'System Alerts' }
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between">
                              <Label htmlFor={key} className="text-sm">{label}</Label>
                              <Switch
                                id={key}
                                checked={settings[key as keyof NotificationSettings]}
                                onCheckedChange={(checked) => updateSettings(key as keyof NotificationSettings, checked)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
                  <X className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Recent updates and alerts from your platform activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                        notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => {
                        setSelectedNotification(notification)
                        markAsRead(notification.id)
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-medium ${
                                notification.read ? 'text-gray-900' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h3>
                              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority.toUpperCase()}
                              </Badge>
                              <Badge className={`text-xs ${getCategoryColor(notification.category)}`}>
                                {notification.category.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          {notification.actionUrl && notification.actionText && (
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Handle navigation
                                }}
                                className="text-xs"
                              >
                                {notification.actionText}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Notification Detail Dialog */}
        <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
          <DialogContent className="max-w-2xl">
            {selectedNotification && (
              <>
                <DialogHeader>
                  <div className="flex items-center space-x-3">
                    {getNotificationIcon(selectedNotification.type)}
                    <div>
                      <DialogTitle>{selectedNotification.title}</DialogTitle>
                      <DialogDescription>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${getPriorityColor(selectedNotification.priority)}`}>
                            {selectedNotification.priority.toUpperCase()}
                          </Badge>
                          <Badge className={`text-xs ${getCategoryColor(selectedNotification.category)}`}>
                            {selectedNotification.category.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(selectedNotification.timestamp)}
                          </span>
                        </div>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">
                      {selectedNotification.message}
                    </p>
                  </div>
                  
                  {selectedNotification.relatedId && (
                    <div className="text-sm text-gray-600">
                      <strong>Related:</strong> {selectedNotification.relatedType} #{selectedNotification.relatedId}
                    </div>
                  )}
                  
                  {selectedNotification.actionUrl && selectedNotification.actionText && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          // Handle navigation
                          setSelectedNotification(null)
                        }}
                      >
                        {selectedNotification.actionText}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedNotification(null)}
                      >
                        Close
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}