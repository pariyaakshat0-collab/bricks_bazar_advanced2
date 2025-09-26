"use client"

import { useEffect, useState } from "react"
import { useNotification } from "./notification-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NotificationDebugger() {
  const { notifications, addNotification, isConnected, connectionStatus } = useNotification()
  const [browserSupport, setBrowserSupport] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [testResult, setTestResult] = useState("")

  useEffect(() => {
    // Check browser support
    if ("Notification" in window) {
      setBrowserSupport(true)
      setPermission(Notification.permission)
    } else {
      setBrowserSupport(false)
    }
  }, [])

  const testNotificationSystem = () => {
    try {
      // Test 1: Add a test notification
      addNotification({
        type: "info",
        title: "Test Notification",
        message: "This is a test notification from the debugger",
        read: false,
        priority: "medium"
      })
      
      // Test 2: Try browser notification
      if (browserSupport && permission === "granted") {
        new Notification("Browser Test", {
          body: "Browser notifications are working!",
          icon: "/favicon.ico"
        })
        setTestResult("✅ All tests passed! Notifications are working.")
      } else {
        setTestResult("✅ In-app notifications working. Browser permissions needed for desktop notifications.")
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const requestBrowserPermission = async () => {
    if (!browserSupport) {
      setTestResult("❌ Browser doesn't support notifications")
      return
    }
    
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      setTestResult(`✅ Permission status: ${result}`)
    } catch (error) {
      setTestResult(`❌ Error requesting permission: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Notification Debugger
          <Badge variant={isConnected ? "default" : "destructive"}>
            {connectionStatus}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">System Status:</h4>
            <div className="space-y-1 text-sm">
              <div>Browser Support: {browserSupport ? "✅" : "❌"}</div>
              <div>Permission: {permission}</div>
              <div>Connected: {isConnected ? "✅" : "❌"}</div>
              <div>Notifications Count: {notifications.length}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Quick Actions:</h4>
            <div className="space-y-2">
              <Button onClick={testNotificationSystem} size="sm" className="w-full">
                Test Notifications
              </Button>
              <Button onClick={requestBrowserPermission} size="sm" variant="outline" className="w-full">
                Request Browser Permission
              </Button>
            </div>
          </div>
        </div>
        
        {testResult && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium">Test Result:</p>
            <p className="text-sm text-blue-800">{testResult}</p>
          </div>
        )}
        
        {notifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Recent Notifications:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {notifications.slice(0, 5).map((notif) => (
                <div key={notif.id} className="text-xs p-2 bg-gray-50 rounded">
                  <div className="font-medium">{notif.title}</div>
                  <div className="text-gray-600">{notif.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}