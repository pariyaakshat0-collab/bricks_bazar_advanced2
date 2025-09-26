"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"

export interface Notification {
  id: string
  type: "success" | "warning" | "info" | "order" | "payment" | "system" | "alert"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority?: "low" | "medium" | "high"
  actionUrl?: string
  actionLabel?: string
  userId?: string
  metadata?: Record<string, any>
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  isConnected: boolean
  connectionStatus: "connected" | "connecting" | "disconnected"
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connecting")

  // Define addNotification first to avoid timing issues
  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }

    setNotifications(prev => [newNotification, ...prev])

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: "/favicon.ico",
        tag: newNotification.id
      })
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    if (!user) return

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setConnectionStatus("connecting")
      
      setTimeout(() => {
        setIsConnected(true)
        setConnectionStatus("connected")
        
        // Send initial connection notification
        addNotification({
          type: "system",
          title: "Connected",
          message: "Real-time notifications enabled",
          read: false,
          priority: "low"
        })
      }, 1000)
    }

    connectWebSocket()

    // Simulate periodic notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        generateRandomNotification()
      }
    }, 30000) // Every 30 seconds

    return () => {
      clearInterval(interval)
      setIsConnected(false)
      setConnectionStatus("disconnected")
    }
  }, [user])

  const generateRandomNotification = () => {
    const notificationTypes = [
      {
        type: "order" as const,
        title: "New Order",
        message: "New order #" + Math.floor(Math.random() * 10000) + " received",
        priority: "high" as const
      },
      {
        type: "payment" as const,
        title: "Payment Received",
        message: "₹" + Math.floor(Math.random() * 50000) + " payment processed",
        priority: "medium" as const
      },
      {
        type: "alert" as const,
        title: "Price Alert",
        message: "Cement prices have changed in your area",
        priority: "medium" as const
      },
      {
        type: "system" as const,
        title: "System Update",
        message: "New features are now available",
        priority: "low" as const
      }
    ]

    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
    
    addNotification({
      ...randomType,
      read: false,
      userId: user?.id
    })
  }

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

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        isConnected,
        connectionStatus
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}