"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  Truck, 
  Route, 
  Zap, 
  Target,
  Fuel,
  Timer,
  Eye,
  RefreshCw,
  Settings,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
  Compass,
  Map,
  Activity
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface RouteStop {
  id: string
  name: string
  address: string
  priority: "urgent" | "high" | "medium" | "low"
  estimatedTime: number
  distance: number
  fuelCost: number
  status: "pending" | "in-progress" | "completed" | "skipped"
  coordinates: { lat: number; lng: number }
  deliveryType: "pickup" | "delivery"
  materials?: string[]
  customerName?: string
  contactNumber?: string
}

interface OptimizedRoute {
  id: string
  name: string
  stops: RouteStop[]
  totalDistance: number
  estimatedTime: number
  fuelCost: number
  efficiency: number
  status: "active" | "completed" | "pending" | "optimizing"
  driver: string
  vehicle: string
  vehicleType: "truck" | "van" | "bike"
  startTime?: string
  endTime?: string
  currentStop?: number
  optimizationLevel: "basic" | "smart" | "ai-enhanced"
  savings: {
    time: number
    fuel: number
    cost: number
  }
}

export default function DistributorRouteOptimizer() {
  const [activeRoute, setActiveRoute] = useState<string>("R1")
  const [optimizationLevel, setOptimizationLevel] = useState<string>("ai-enhanced")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [autoOptimization, setAutoOptimization] = useState(true)
  const [trafficConsideration, setTrafficConsideration] = useState(true)
  const [fuelPriority, setFuelPriority] = useState(70)
  const [timePriority, setTimePriority] = useState(80)

  const [routes, setRoutes] = useState<OptimizedRoute[]>([
    {
      id: "R1",
      name: "North Bangalore Route",
      stops: [
        {
          id: "S1",
          name: "Steel Warehouse",
          address: "Yeshwanthpur Industrial Area",
          priority: "high",
          estimatedTime: 30,
          distance: 12,
          fuelCost: 180,
          status: "completed",
          coordinates: { lat: 13.0289, lng: 77.5459 },
          deliveryType: "pickup",
          materials: ["TMT Steel Rods (5 tons)", "Steel Beams (2 tons)"]
        },
        {
          id: "S2",
          name: "BuildWell Constructions",
          address: "MG Road, Bangalore",
          priority: "urgent",
          estimatedTime: 45,
          distance: 15,
          fuelCost: 220,
          status: "in-progress",
          coordinates: { lat: 12.9716, lng: 77.5946 },
          deliveryType: "delivery",
          customerName: "BuildWell Constructions",
          contactNumber: "+91 98765 43210",
          materials: ["TMT Steel Rods (3 tons)"]
        },
        {
          id: "S3",
          name: "Skyline Developers",
          address: "Whitefield, Bangalore",
          priority: "high",
          estimatedTime: 60,
          distance: 22,
          fuelCost: 280,
          status: "pending",
          coordinates: { lat: 12.9698, lng: 77.7500 },
          deliveryType: "delivery",
          customerName: "Skyline Developers",
          contactNumber: "+91 87654 32109",
          materials: ["Steel Beams (2 tons)", "Binding Wire (50 kg)"]
        },
        {
          id: "S4",
          name: "Green Homes Ltd",
          address: "Electronic City, Bangalore",
          priority: "medium",
          estimatedTime: 55,
          distance: 18,
          fuelCost: 250,
          status: "pending",
          coordinates: { lat: 12.8496, lng: 77.6760 },
          deliveryType: "delivery",
          customerName: "Green Homes Ltd",
          contactNumber: "+91 76543 21098",
          materials: ["TMT Steel Rods (2 tons)"]
        }
      ],
      totalDistance: 67,
      estimatedTime: 190,
      fuelCost: 930,
      efficiency: 92,
      status: "active",
      driver: "Rajesh Kumar",
      vehicle: "KA-01-AB-1234",
      vehicleType: "truck",
      startTime: "08:00 AM",
      currentStop: 2,
      optimizationLevel: "ai-enhanced",
      savings: {
        time: 25,
        fuel: 85,
        cost: 1200
      }
    },
    {
      id: "R2",
      name: "East Bangalore Route",
      stops: [
        {
          id: "S5",
          name: "Cement Depot",
          address: "Hoskote Industrial Area",
          priority: "high",
          estimatedTime: 25,
          distance: 18,
          fuelCost: 200,
          status: "completed",
          coordinates: { lat: 13.0706, lng: 77.7982 },
          deliveryType: "pickup",
          materials: ["Cement (500 bags)"]
        },
        {
          id: "S6",
          name: "Urban Infrastructure",
          address: "Koramangala, Bangalore",
          priority: "urgent",
          estimatedTime: 35,
          distance: 12,
          fuelCost: 150,
          status: "pending",
          coordinates: { lat: 12.9352, lng: 77.6245 },
          deliveryType: "delivery",
          customerName: "Urban Infrastructure",
          contactNumber: "+91 65432 10987",
          materials: ["Cement (200 bags)"]
        },
        {
          id: "S7",
          name: "Mega Construction Co",
          address: "HSR Layout, Bangalore",
          priority: "medium",
          estimatedTime: 50,
          distance: 20,
          fuelCost: 180,
          status: "pending",
          coordinates: { lat: 12.9121, lng: 77.6446 },
          deliveryType: "delivery",
          customerName: "Mega Construction Co",
          contactNumber: "+91 54321 09876",
          materials: ["Cement (300 bags)"]
        }
      ],
      totalDistance: 50,
      estimatedTime: 110,
      fuelCost: 530,
      efficiency: 88,
      status: "pending",
      driver: "Suresh Singh",
      vehicle: "KA-02-CD-5678",
      vehicleType: "truck",
      optimizationLevel: "smart",
      savings: {
        time: 15,
        fuel: 45,
        cost: 800
      }
    }
  ])

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
      case "completed": return "default"
      case "in-progress": return "secondary"
      case "pending": return "outline"
      case "skipped": return "destructive"
      default: return "outline"
    }
  }

  const runOptimization = async () => {
    setIsOptimizing(true)
    // Simulate AI optimization
    setTimeout(() => {
      setRoutes(prev => prev.map(route => 
        route.id === activeRoute ? {
          ...route,
          efficiency: Math.min(100, route.efficiency + Math.random() * 8),
          fuelCost: Math.round(route.fuelCost * (0.85 + Math.random() * 0.1)),
          estimatedTime: Math.round(route.estimatedTime * (0.9 + Math.random() * 0.05)),
          savings: {
            time: route.savings.time + Math.round(Math.random() * 10),
            fuel: route.savings.fuel + Math.round(Math.random() * 20),
            cost: route.savings.cost + Math.round(Math.random() * 200)
          }
        } : route
      ))
      setIsOptimizing(false)
    }, 3000)
  }

  const updateStopStatus = (routeId: string, stopId: string, newStatus: string) => {
    setRoutes(prev => prev.map(route => 
      route.id === routeId ? {
        ...route,
        stops: route.stops.map(stop => 
          stop.id === stopId ? { ...stop, status: newStatus as any } : stop
        )
      } : route
    ))
  }

  const currentRoute = routes.find(route => route.id === activeRoute)

  if (!currentRoute) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Compass className="h-8 w-8 text-yellow-300" />
              <div>
                <h1 className="text-2xl font-bold">Route Optimizer</h1>
                <p className="text-blue-100">AI-powered delivery route optimization</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Brain className="h-4 w-4 text-yellow-300" />
                <span>AI Optimization</span>
              </div>
              <div className="flex items-center gap-1">
                <Map className="h-4 w-4 text-green-300" />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-purple-300" />
                <span>Smart Routing</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button onClick={runOptimization} disabled={isOptimizing}>
              {isOptimizing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isOptimizing ? "Optimizing..." : "Optimize Route"}
            </Button>
          </div>
        </div>
      </div>

      {/* Route Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Active Routes
          </CardTitle>
          <CardDescription>Select and manage your delivery routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <div 
                key={route.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  activeRoute === route.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveRoute(route.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{route.name}</h4>
                    <p className="text-sm text-muted-foreground">{route.driver}</p>
                  </div>
                  <Badge variant={route.status === "active" ? "default" : route.status === "completed" ? "secondary" : "outline"}>
                    {route.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-medium">{route.totalDistance} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-medium">{route.estimatedTime} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel</p>
                    <p className="font-medium">₹{route.fuelCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                    <p className="font-medium">{route.efficiency}%</p>
                  </div>
                </div>
                
                <Progress value={route.efficiency} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Map className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentRoute.totalDistance} km</div>
            <p className="text-xs text-muted-foreground">Route distance</p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Time</CardTitle>
            <Timer className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{currentRoute.estimatedTime} min</div>
            <p className="text-xs text-muted-foreground">Delivery time</p>
            <Progress value={80} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Cost</CardTitle>
            <Fuel className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{currentRoute.fuelCost}</div>
            <p className="text-xs text-muted-foreground">Estimated fuel cost</p>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{currentRoute.efficiency}%</div>
            <p className="text-xs text-muted-foreground">Route efficiency</p>
            <Progress value={currentRoute.efficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI Optimization Benefits */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Sparkles className="h-5 w-5" />
            AI Optimization Benefits
          </CardTitle>
          <CardDescription className="text-purple-700">
            Smart savings achieved through AI-powered route optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">{currentRoute.savings.time} min</p>
              <p className="text-sm text-purple-700">Time Saved</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center justify-center mb-2">
                <Fuel className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{currentRoute.savings.fuel} L</p>
              <p className="text-sm text-purple-700">Fuel Saved</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600">₹{currentRoute.savings.cost}</p>
              <p className="text-sm text-purple-700">Cost Saved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Stops */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Route Stops ({currentRoute.stops.length})
          </CardTitle>
          <CardDescription>Manage and track all route stops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentRoute.stops.map((stop, index) => (
              <div key={stop.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{stop.name}</h4>
                      <p className="text-sm text-muted-foreground">{stop.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(stop.status)}>
                      {stop.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{stop.priority.toUpperCase()}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{stop.deliveryType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-medium">{stop.distance} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Time</p>
                    <p className="font-medium">{stop.estimatedTime} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel Cost</p>
                    <p className="font-medium">₹{stop.fuelCost}</p>
                  </div>
                </div>

                {stop.materials && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Materials</p>
                    <div className="flex flex-wrap gap-1">
                      {stop.materials.map((material, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {stop.customerName && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Customer Details</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {stop.customerName}
                      </span>
                      {stop.contactNumber && (
                        <span className="flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          {stop.contactNumber}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {stop.coordinates.lat.toFixed(4)}, {stop.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {stop.status === "pending" && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => updateStopStatus(currentRoute.id, stop.id, "in-progress")}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                    {stop.status === "in-progress" && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => updateStopStatus(currentRoute.id, stop.id, "completed")}
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

      {/* Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Route Optimizer Settings</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Optimization Level</Label>
                <Select value={optimizationLevel} onValueChange={setOptimizationLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select optimization level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Optimization</SelectItem>
                    <SelectItem value="smart">Smart Optimization</SelectItem>
                    <SelectItem value="ai-enhanced">AI-Enhanced Optimization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Auto-Optimization</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={autoOptimization}
                    onChange={(e) => setAutoOptimization(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Enable automatic route optimization</span>
                </div>
              </div>
              
              <div>
                <Label>Consider Traffic</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={trafficConsideration}
                    onChange={(e) => setTrafficConsideration(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Include real-time traffic data</span>
                </div>
              </div>
              
              <div>
                <Label>Time Priority: {timePriority}%</Label>
                <Slider
                  value={[timePriority]}
                  onValueChange={(value) => setTimePriority(value[0])}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
              
              <div>
                <Label>Fuel Priority: {fuelPriority}%</Label>
                <Slider
                  value={[fuelPriority]}
                  onValueChange={(value) => setFuelPriority(value[0])}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={() => setShowSettings(false)} className="flex-1">
                Save Settings
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
