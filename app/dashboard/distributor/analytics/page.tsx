"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  Star, 
  Truck, 
  BarChart3, 
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar
} from "lucide-react"

export default function DistributorAnalyticsPage() {
  const [totalDeliveries] = useState(1250)
  const [activeDeliveries] = useState(45)
  const [revenue] = useState(2850000)
  const [customerRating] = useState(4.6)
  const [onTimeDelivery] = useState(94)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your delivery performance and business metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">Currently in transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(revenue/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerRating}</div>
            <p className="text-xs text-muted-foreground">Based on 234 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Delivery Performance
            </CardTitle>
            <CardDescription>On-time delivery metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">On-Time Delivery Rate</span>
                <Badge variant="default" className="bg-green-500">{onTimeDelivery}%</Badge>
              </div>
              <Progress value={onTimeDelivery} className="bg-green-500" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">94%</p>
                  <p className="text-sm text-muted-foreground">On-Time</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">6%</p>
                  <p className="text-sm text-muted-foreground">Delayed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Regional Performance
            </CardTitle>
            <CardDescription>Delivery metrics by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { region: "North Zone", deliveries: 450, revenue: "₹12.5L", rating: 4.7 },
                { region: "South Zone", deliveries: 380, revenue: "₹10.8L", rating: 4.5 },
                { region: "East Zone", deliveries: 290, revenue: "₹8.2L", rating: 4.6 },
                { region: "West Zone", deliveries: 130, revenue: "₹3.7L", rating: 4.4 }
              ].map((region) => (
                <div key={region.region} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{region.region}</p>
                    <p className="text-sm text-muted-foreground">
                      {region.deliveries} deliveries • {region.revenue}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{region.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Delivery Trends
          </CardTitle>
          <CardDescription>Monthly delivery volume and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { month: "January", deliveries: 420, revenue: "₹9.2L", growth: "+5%" },
              { month: "February", deliveries: 480, revenue: "₹10.8L", growth: "+14%" },
              { month: "March", deliveries: 350, revenue: "₹8.1L", growth: "-27%" }
            ].map((month) => (
              <div key={month.month} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{month.month}</h4>
                  <Badge 
                    variant={month.growth.startsWith('+') ? 'default' : 'destructive'}
                    className={month.growth.startsWith('+') ? 'bg-green-500' : 'bg-red-500'}
                  >
                    {month.growth}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deliveries:</span>
                    <span>{month.deliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span>{month.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Delivery Activity
          </CardTitle>
          <CardDescription>Latest delivery updates and status changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "DEL-2024-001",
                customer: "Reliable Builders",
                status: "Delivered",
                time: "2 hours ago",
                location: "North Zone"
              },
              {
                id: "DEL-2024-002", 
                customer: "Modern Construction",
                status: "In Transit",
                time: "4 hours ago",
                location: "South Zone"
              },
              {
                id: "DEL-2024-003",
                customer: "Green Homes Ltd.",
                status: "Dispatched",
                time: "6 hours ago",
                location: "East Zone"
              }
            ].map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{delivery.customer}</p>
                  <p className="text-sm text-muted-foreground">
                    {delivery.id} • {delivery.location}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      delivery.status === "Delivered"
                        ? "default"
                        : delivery.status === "In Transit"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {delivery.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{delivery.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}