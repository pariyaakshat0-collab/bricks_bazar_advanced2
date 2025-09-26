"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, AlertCircle, Info, Package, CreditCard, Wifi, WifiOff, Settings, Trash2, Check, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useNotification, Notification } from "./notification-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function EnhancedNotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll,
    isConnected,
    connectionStatus 
  } = useNotification()

  const [filter, setFilter] = useState<"all" | "unread" | "high" | "medium" | "low">("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [desktopEnabled, setDesktopEnabled] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read
    if (filter === "high") return notification.priority === "high"
    if (filter === "medium") return notification.priority === "medium"
    if (filter === "low") return notification.priority === "low"
    return true
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "order":
        return <Package className="h-4 w-4 text-blue-500" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-green-500" />
      case "system":
        return <Info className="h-4 w-4 text-purple-500" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return `${Math.floor(minutes / 1440)}d ago`
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          {!isConnected && (
            <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SheetTitle>Notifications</SheetTitle>
              {connectionStatus === "connecting" && <WifiOff className="h-4 w-4 text-yellow-500" />}
              {connectionStatus === "connected" && <Wifi className="h-4 w-4 text-green-500" />}
              {connectionStatus === "disconnected" && <WifiOff className="h-4 w-4 text-red-500" />}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter notifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                  <Label htmlFor="sound" className="text-xs">Sound</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="desktop"
                    checked={desktopEnabled}
                    onCheckedChange={setDesktopEnabled}
                  />
                  <Label htmlFor="desktop" className="text-xs">Desktop</Label>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-200px)] mt-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md",
                    notification.read 
                      ? "bg-muted/30 border-muted-foreground/20" 
                      : "bg-background border-border hover:bg-muted/20",
                    notification.priority === "high" && "border-l-4 border-l-red-500"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          {notification.priority && (
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs px-1 py-0", getPriorityColor(notification.priority))}
                            >
                              {notification.priority}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                          {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      {notification.actionUrl && notification.actionLabel && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.actionLabel}
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}