"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Navigation, 
  Zap, 
  BarChart3,
  Target,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Search,
  Plus,
  Minus,
  Wrench,
  Route,
  Fuel,
  Timer,
  Eye,
  Brain,
  MessageSquare,
  Bell,
  Bot,
  Sparkles,
  Compass,
  Map,
  Navigation2,
  Activity
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import DistributorRouteOptimizer from "@/components/smart-tools/distributor-route-optimizer"
import DeliveryOptimizer from "@/components/smart-tools/delivery-optimizer"

interface DeliveryRequest {
  id: string
  orderId: string
  customerName: string
  customerLocation: string
  materials: string[]
  totalWeight: number
  deliveryDate: string
  priority: "urgent" | "high" | "medium" | "low"
  status: "pending" | "assigned" | "in-transit" | "delivered"
  distance: number
  estimatedTime: number
  fuelCost: number
  driverName?: string
  vehicleNumber?: string
  currentLocation?: string
  progress?: number
}

interface Route {
  id: string
  name: string
  totalDistance: number
  estimatedTime: number
  fuelCost: number
  deliveries: number
  efficiency: number
  status: "active" | "completed" | "pending"
  startTime?: string
  endTime?: string
  driver: string
  vehicle: string
}

interface PerformanceMetric {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  icon: any
}

export default function DistributorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([
    {
      id: "1",
      orderId: "ORD-2024-001",
      customerName: "BuildWell Constructions",
      customerLocation: "MG Road, Bangalore",
      materials: ["Steel Rods (10 tons)", "Cement (200 bags)"],
      totalWeight: 12000,
      deliveryDate: "2024-01-16",
      priority: "urgent",
      status: "in-transit",
      distance: 15,
      estimatedTime: 45,
      fuelCost: 850,
      driverName: "Rajesh Kumar",
      vehicleNumber: "KA-01-AB-1234",
      currentLocation: "5 km from destination",
      progress: 75
    },
    {
      id: "2",
      orderId: "ORD-2024-002",
      customerName: "Skyline Developers",
      customerLocation: "Whitefield, Bangalore",
      materials: ["Concrete Blocks (500 units)", "Sand (15 tons)"],
      totalWeight: 18000,
      deliveryDate: "2024-01-16",
      priority: "high",
      status: "assigned",
      distance: 22,
      estimatedTime: 60,
      fuelCost: 1200,
      driverName: "Suresh Singh",
      vehicleNumber: "KA-02-CD-5678",
      currentLocation: "Warehouse",
      progress: 0
    },
    {
      id: "3",
      orderId: "ORD-2024-003",
      customerName: "Green Homes Ltd",
      customerLocation: "Electronic City, Bangalore",
      materials: ["Bricks (8000 units)", "Tiles (300 sqft)"],
      totalWeight: 25000,
      deliveryDate: "2024-01-17",
      priority: "medium",
      status: "pending",
      distance: 18,
      estimatedTime: 55,
      fuelCost: 950
    },
    {
      id: "4",
      orderId: "ORD-2024-004",
      customerName: "Urban Infrastructure",
      customerLocation: "Koramangala, Bangalore",
      materials: ["Steel Beams (8 tons)", "Binding Wire (50 kg)"],
      totalWeight: 8500,
      deliveryDate: "2024-01-17",
      priority: "urgent",
      status: "pending",
      distance: 12,
      estimatedTime: 35,
      fuelCost: 650
    },
    {
      id: "5",
      orderId: "ORD-2024-005",
      customerName: "Mega Construction Co",
      customerLocation: "HSR Layout, Bangalore",
      materials: ["Cement (150 bags)", "Aggregates (12 tons)"],
      totalWeight: 14000,
      deliveryDate: "2024-01-18",
      priority: "low",
      status: "pending",
      distance: 20,
      estimatedTime: 50,
      fuelCost: 1050
    }
  ])

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "R1",
      name: "North Bangalore Route",
      totalDistance: 85,
      estimatedTime: 240,
      fuelCost: 2850,
      deliveries: 4,
      efficiency: 92,
      status: "active",
      startTime: "08:00 AM",
      driver: "Rajesh Kumar",
      vehicle: "KA-01-AB-1234"
    },
    {
      id: "R2",
      name: "East Bangalore Route",
      totalDistance: 120,
      estimatedTime: 300,
      fuelCost: 3200,
      deliveries: 5,
      efficiency: 88,
      status: "completed",
      startTime: "09:00 AM",
      endTime: "02:00 PM",
      driver: "Suresh Singh",
      vehicle: "KA-02-CD-5678"
    },
    {
      id: "R3",
      name: "South Bangalore Route",
      totalDistance: 95,
      estimatedTime: 270,
      fuelCost: 2950,
      deliveries: 3,
      efficiency: 85,
      status: "pending",
      driver: "Amit Patel",
      vehicle: "KA-03-EF-9012"
    }
  ])

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    { label: "On-Time Delivery Rate", value: "94.2%", change: "+2.1%", trend: "up", icon: Clock },
    { label: "Fuel Efficiency", value: "8.5 km/l", change: "+0.3 km/l", trend: "up", icon: Fuel },
    { label: "Average Delivery Time", value: "42 min", change: "-5 min", trend: "up", icon: Timer },
    { label: "Customer Satisfaction", value: "4.8/5", change: "+0.2", trend: "up", icon: Star }
  ])

  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered": return "default"
      case "in-transit": return "secondary"
      case "assigned": return "outline"
      case "pending": return "destructive"
      default: return "outline"
    }
  }

  const filteredRequests = deliveryRequests.filter(request => {
    const matchesPriority = selectedPriority === "all" || request.priority === selectedPriority
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customerLocation.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesPriority && matchesSearch
  })

  const runRouteOptimization = async () => {
    setIsOptimizing(true)
    // Simulate AI optimization
    setTimeout(() => {
      setRoutes(prev => prev.map(route => ({
        ...route,
        efficiency: Math.min(100, route.efficiency + Math.random() * 10),
        fuelCost: Math.round(route.fuelCost * (0.9 + Math.random() * 0.1))
      })))
      setIsOptimizing(false)
    }, 2000)
  }

  const updateDeliveryStatus = (requestId: string, newStatus: string) => {
    setDeliveryRequests(prev => prev.map(request => 
      request.id === requestId ? { 
        ...request, 
        status: newStatus as any,
        progress: newStatus === "delivered" ? 100 : request.progress
      } : request
    ))
  }

  const totalDeliveries = deliveryRequests.length
  const completedDeliveries = deliveryRequests.filter(r => r.status === "delivered").length
  const inTransitDeliveries = deliveryRequests.filter(r => r.status === "in-transit").length
  const totalRevenue = deliveryRequests.reduce((sum, request) => sum + (request.fuelCost * 1.5), 0)

  return (
    <div className="space-y-6">
      {/* Header - Simplified to avoid duplication with sidebar */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-yellow-300" />
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Distributor'}</h1>
                <p className="text-purple-100">AI-powered delivery optimization and fleet management</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Navigation className="h-4 w-4 text-yellow-300" />
                <span>Route Optimization</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-green-300" />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="h-4 w-4 text-blue-300" />
                <span>AI Predictions</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">Active deliveries</p>
            <Progress value={(completedDeliveries / totalDeliveries) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedDeliveries}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inTransitDeliveries}</div>
            <p className="text-xs text-muted-foreground">Currently delivering</p>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{(totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="deliveries" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Deliveries
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Optimization
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Smart Tools Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Smart Tools
              </CardTitle>
              <CardDescription>Access your AI-powered optimization tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveTab("routes")}
                >
                  <Route className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">Route Optimizer</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveTab("deliveries")}
                >
                  <Truck className="h-6 w-6 text-green-500" />
                  <span className="text-sm font-medium">Delivery Tracker</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveTab("optimization")}
                >
                  <Brain className="h-6 w-6 text-purple-500" />
                  <span className="text-sm font-medium">AI Optimization</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart3 className="h-6 w-6 text-orange-500" />
                  <span className="text-sm font-medium">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                    <Icon className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recent Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Deliveries
              </CardTitle>
              <CardDescription>Latest delivery updates and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`} />
                        <div>
                          <h4 className="font-medium">{request.customerName}</h4>
                          <p className="text-sm text-muted-foreground">{request.customerLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{request.priority.toUpperCase()}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="font-medium">{request.orderId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="font-medium">{request.distance} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Time</p>
                        <p className="font-medium">{request.estimatedTime} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Cost</p>
                        <p className="font-medium">₹{request.fuelCost}</p>
                      </div>
                    </div>

                    {request.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Delivery Progress</span>
                          <span className="text-sm text-muted-foreground">{request.progress}%</span>
                        </div>
                        <Progress value={request.progress} className="h-2" />
                      </div>
                    )}

                    {request.currentLocation && (
                      <Alert className="mb-3">
                        <Navigation className="h-4 w-4" />
                        <AlertDescription>Current Location: {request.currentLocation}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {request.vehicleNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {request.driverName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateDeliveryStatus(request.id, "in-transit")}
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-6">
          {/* Delivery Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
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

          {/* Delivery Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Delivery Requests ({filteredRequests.length})
              </CardTitle>
              <CardDescription>Manage and track all delivery requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`} />
                        <div>
                          <h4 className="font-medium">{request.customerName}</h4>
                          <p className="text-sm text-muted-foreground">{request.customerLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{request.priority.toUpperCase()}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="font-medium">{request.orderId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="font-medium">{request.distance} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Time</p>
                        <p className="font-medium">{request.estimatedTime} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Cost</p>
                        <p className="font-medium">₹{request.fuelCost}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Materials</p>
                      <div className="flex flex-wrap gap-1">
                        {request.materials.map((material, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {request.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Delivery Progress</span>
                          <span className="text-sm text-muted-foreground">{request.progress}%</span>
                        </div>
                        <Progress value={request.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.deliveryDate}
                        </span>
                        {request.vehicleNumber && (
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {request.vehicleNumber}
                          </span>
                        )}
                        {request.driverName && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {request.driverName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {request.status === "pending" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateDeliveryStatus(request.id, "assigned")}
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                        {request.status === "assigned" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateDeliveryStatus(request.id, "in-transit")}
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Start Delivery
                          </Button>
                        )}
                        {request.status === "in-transit" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateDeliveryStatus(request.id, "delivered")}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <DistributorRouteOptimizer />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <DeliveryOptimizer />
          
          {/* AI Optimization Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Route Optimization
              </CardTitle>
              <CardDescription>Optimize delivery routes using artificial intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Smart Route Planning</h4>
                      <p className="text-sm text-muted-foreground">AI-powered route optimization</p>
                    </div>
                  </div>
                  <Button onClick={runRouteOptimization} disabled={isOptimizing}>
                    {isOptimizing ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    {isOptimizing ? "Optimizing..." : "Run Optimization"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Fuel Efficiency</h4>
                      <p className="text-sm text-muted-foreground">Optimize fuel consumption</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Fuel className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">Time Optimization</h4>
                      <p className="text-sm text-muted-foreground">Minimize delivery times</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Timer className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Delivery Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">On-Time Deliveries</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Route Efficiency</span>
                    <span className="font-medium">88.5%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fuel Costs</span>
                    <span className="font-medium">₹{(totalRevenue * 0.4).toFixed(0)}K</span>
                  </div>
                  <Progress value={40} className="h-2 bg-orange-500" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Driver Wages</span>
                    <span className="font-medium">₹{(totalRevenue * 0.3).toFixed(0)}K</span>
                  </div>
                  <Progress value={30} className="h-2 bg-blue-500" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Maintenance</span>
                    <span className="font-medium">₹{(totalRevenue * 0.15).toFixed(0)}K</span>
                  </div>
                  <Progress value={15} className="h-2 bg-green-500" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profit</span>
                    <span className="font-medium">₹{(totalRevenue * 0.15).toFixed(0)}K</span>
                  </div>
                  <Progress value={15} className="h-2 bg-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Route Efficiency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map((route) => (
                  <div key={route.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{route.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {route.deliveries} deliveries • {route.totalDistance} km
                        </p>
                      </div>
                      <Badge variant={route.status === "active" ? "default" : route.status === "completed" ? "secondary" : "outline"}>
                        {route.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                        <p className="font-medium">{route.efficiency}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Time</p>
                        <p className="font-medium">{route.estimatedTime} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Cost</p>
                        <p className="font-medium">₹{route.fuelCost}</p>
                      </div>
                    </div>
                    
                    <Progress value={route.efficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Distributor Settings</DialogTitle>
            <DialogDescription>
              Configure your distribution and delivery preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>Default Route Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time Optimization</SelectItem>
                  <SelectItem value="fuel">Fuel Efficiency</SelectItem>
                  <SelectItem value="distance">Shortest Distance</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Auto-Assignment Threshold</Label>
              <Slider
                defaultValue={[80]}
                max={100}
                min={50}
                step={5}
              />
              <p className="text-sm text-muted-foreground">Current: 80%</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
