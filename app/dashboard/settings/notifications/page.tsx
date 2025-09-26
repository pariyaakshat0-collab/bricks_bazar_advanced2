"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Mail, Smartphone, Tablet, BellRing, BellOff, Settings, Save, RefreshCw } from "lucide-react"
import { EnhancedDashboardHeader } from "@/components/shared/enhanced-dashboard-header"

interface NotificationPreference {
  id: string
  type: string
  title: string
  description: string
  enabled: boolean
  channels: {
    email: boolean
    push: boolean
    sms: boolean
    inApp: boolean
  }
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
}

export default function NotificationsSettingsPage() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<NotificationPreference[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [masterToggle, setMasterToggle] = useState(true)
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: "22:00",
    end: "07:00"
  })

  useEffect(() => {
    // Simulate loading notification preferences
    setTimeout(() => {
      setPreferences([
        {
          id: "1",
          type: "order_updates",
          title: "Order Updates",
          description: "Get notified about order status changes, confirmations, and cancellations",
          enabled: true,
          channels: { email: true, push: true, sms: false, inApp: true },
          frequency: "realtime"
        },
        {
          id: "2",
          type: "delivery_tracking",
          title: "Delivery Tracking",
          description: "Track your deliveries in real-time with live updates and estimated arrival times",
          enabled: true,
          channels: { email: true, push: true, sms: true, inApp: true },
          frequency: "realtime"
        },
        {
          id: "3",
          type: "inventory_alerts",
          title: "Inventory Alerts",
          description: "Receive alerts when inventory levels are low or items are back in stock",
          enabled: true,
          channels: { email: true, push: true, sms: false, inApp: true },
          frequency: "daily"
        },
        {
          id: "4",
          type: "price_changes",
          title: "Price Changes",
          description: "Get notified about price changes for your favorite products and materials",
          enabled: false,
          channels: { email: true, push: true, sms: false, inApp: false },
          frequency: "weekly"
        },
        {
          id: "5",
          type: "payment_reminders",
          title: "Payment Reminders",
          description: "Receive payment due reminders and payment confirmation notifications",
          enabled: true,
          channels: { email: true, push: true, sms: true, inApp: true },
          frequency: "daily"
        },
        {
          id: "6",
          type: "promotional_offers",
          title: "Promotional Offers",
          description: "Stay updated with exclusive deals, discounts, and promotional campaigns",
          enabled: false,
          channels: { email: true, push: false, sms: false, inApp: false },
          frequency: "weekly"
        },
        {
          id: "7",
          type: "system_maintenance",
          title: "System Maintenance",
          description: "Get notified about scheduled maintenance and system updates",
          enabled: true,
          channels: { email: true, push: false, sms: false, inApp: true },
          frequency: "daily"
        },
        {
          id: "8",
          type: "security_alerts",
          title: "Security Alerts",
          description: "Important security notifications and account activity alerts",
          enabled: true,
          channels: { email: true, push: true, sms: true, inApp: true },
          frequency: "realtime"
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const updatePreference = (id: string, updates: Partial<NotificationPreference>) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, ...updates } : pref
    ))
  }

  const updateChannel = (id: string, channel: keyof NotificationPreference['channels'], value: boolean) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { 
        ...pref, 
        channels: { ...pref.channels, [channel]: value }
      } : pref
    ))
  }

  const savePreferences = () => {
    // Simulate saving preferences
    console.log('Saving preferences:', { preferences, masterToggle, quietHours })
    alert('Notification preferences saved successfully!')
  }

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all notification preferences to default settings?')) {
      // Reset to default values
      setPreferences(prev => prev.map(pref => ({ ...pref, enabled: true })))
      setMasterToggle(true)
      setQuietHours({ enabled: false, start: "22:00", end: "07:00" })
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'realtime': return 'bg-green-100 text-green-800'
      case 'hourly': return 'bg-blue-100 text-blue-800'
      case 'daily': return 'bg-yellow-100 text-yellow-800'
      case 'weekly': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EnhancedDashboardHeader title="Notification Settings" subtitle="Customize your notification preferences" />
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedDashboardHeader title="Notification Settings" subtitle="Customize your notification preferences" />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
              <p className="text-gray-600">Customize how and when you receive notifications</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button size="sm" onClick={savePreferences}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Master Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Master Notification Control
              </CardTitle>
              <CardDescription>
                Enable or disable all notifications at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="master-toggle" className="text-base font-medium">
                    All Notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    {masterToggle ? "Notifications are enabled" : "Notifications are disabled"}
                  </p>
                </div>
                <Switch
                  id="master-toggle"
                  checked={masterToggle}
                  onCheckedChange={setMasterToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellOff className="h-5 w-5" />
                Quiet Hours
              </CardTitle>
              <CardDescription>
                Set quiet hours to reduce notification interruptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quiet-hours" className="text-base font-medium">
                      Enable Quiet Hours
                    </Label>
                    <p className="text-sm text-gray-500">
                      {quietHours.enabled ? "Quiet hours are active" : "Quiet hours are disabled"}
                    </p>
                  </div>
                  <Switch
                    id="quiet-hours"
                    checked={quietHours.enabled}
                    onCheckedChange={(checked) => setQuietHours(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>
                
                {quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Start Time</Label>
                      <input
                        id="start-time"
                        type="time"
                        value={quietHours.start}
                        onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time">End Time</Label>
                      <input
                        id="end-time"
                        type="time"
                        value={quietHours.end}
                        onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <div className="space-y-4">
            {preferences.map((preference) => (
              <Card key={preference.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {preference.title}
                        <Badge className={getFrequencyColor(preference.frequency)}>
                          {preference.frequency.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{preference.description}</CardDescription>
                    </div>
                    <Switch
                      checked={preference.enabled && masterToggle}
                      onCheckedChange={(checked) => updatePreference(preference.id, { enabled: checked })}
                      disabled={!masterToggle}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {preference.enabled && masterToggle && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`email-${preference.id}`}
                              checked={preference.channels.email}
                              onCheckedChange={(checked) => updateChannel(preference.id, 'email', checked)}
                            />
                            <Label htmlFor={`email-${preference.id}`} className="text-sm">
                              Email
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-gray-500" />
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`push-${preference.id}`}
                              checked={preference.channels.push}
                              onCheckedChange={(checked) => updateChannel(preference.id, 'push', checked)}
                            />
                            <Label htmlFor={`push-${preference.id}`} className="text-sm">
                              Push
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <BellRing className="h-4 w-4 text-gray-500" />
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`sms-${preference.id}`}
                              checked={preference.channels.sms}
                              onCheckedChange={(checked) => updateChannel(preference.id, 'sms', checked)}
                            />
                            <Label htmlFor={`sms-${preference.id}`} className="text-sm">
                              SMS
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Tablet className="h-4 w-4 text-gray-500" />
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`inapp-${preference.id}`}
                              checked={preference.channels.inApp}
                              onCheckedChange={(checked) => updateChannel(preference.id, 'inApp', checked)}
                            />
                            <Label htmlFor={`inapp-${preference.id}`} className="text-sm">
                              In-App
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium">Frequency:</Label>
                        <select
                          value={preference.frequency}
                          onChange={(e) => updatePreference(preference.id, { frequency: e.target.value as any })}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="realtime">Real-time</option>
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}