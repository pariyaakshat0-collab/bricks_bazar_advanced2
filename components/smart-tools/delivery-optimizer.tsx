"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { 
  Truck, 
  Clock, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Zap,
  Brain,
  Sparkles,
  Navigation,
  Fuel,
  Timer,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Target,
  Activity,
  Compass,
  Map,
  Star,
  Award,
  Calendar,
  MessageSquare,
  Bell,
  Bot,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Package,
  Route,
  Thermometer,
  Cloud,
  Wind,
  AlertCircle,
  Check,
  X,
  Send,
  Phone,
  Mail,
  FileText,
  Download,
  Upload,
  Camera,
  QrCode,
  Smartphone,
  Tablet,
  Monitor
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface DeliveryRequest {
  id: string
  customer: string
  location: string
  materials: string[]
  priority: "urgent" | "high" | "medium" | "low"
  requestedTime: string
  estimatedDuration: number
  distance: number
  fuelCost: number
  status: "pending" | "assigned" | "in-transit" | "delivered" | "cancelled"
  coordinates: { lat: number; lng: number }
  contactNumber: string
  deliveryType: "pickup" | "delivery"
  weight: number
  volume: number
  specialRequirements?: string[]
  assignedVehicle?: string
  assignedDriver?: string
  estimatedArrival?: string
  actualArrival?: string
  rating?: number
  feedback?: string
  weatherImpact?: "none" | "low" | "medium" | "high"
  trafficImpact?: "none" | "low" | "medium" | "high"
  aiConfidence?: number
  optimalRoute?: string[]
  alternativeRoutes?: string[][]
}

interface OptimizedRoute {
  id: string
  name: string
  deliveries: DeliveryRequest[]
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
  emissions: {
    co2: number
    nox: number
    pm25: number
  }
  weatherConditions?: {
    temperature: number
    condition: string
    windSpeed: number
    humidity: number
  }
  trafficConditions?: {
    level: "low" | "medium" | "high"
    averageSpeed: number
    congestionPoints: number
  }
}

interface AIInsight {
  id: string
  type: "weather" | "traffic" | "fuel" | "efficiency" | "maintenance"
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  confidence: number
  recommendedAction?: string
  estimatedSavings?: {
    time?: number
    fuel?: number
    cost?: number
  }
}

interface Vehicle {
  id: string
  registration: string
  type: "truck" | "van" | "bike"
  capacity: {
    weight: number
    volume: number
  }
  fuelEfficiency: number
  currentLocation: { lat: number; lng: number }
  status: "available" | "in-use" | "maintenance" | "offline"
  driver: string
  lastMaintenance: string
  nextMaintenance: string
  fuelLevel: number
  telematicsData?: {
    speed: number
    engineTemp: number
    fuelConsumption: number
    tirePressure: number[]
  }
}

export default function DeliveryOptimizer() {
  const [activeTab, setActiveTab] = useState("overview")
  const [optimizationLevel, setOptimizationLevel] = useState("ai-enhanced")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [autoOptimization, setAutoOptimization] = useState(true)
  const [ecoMode, setEcoMode] = useState(true)
  const [realTimeTracking, setRealTimeTracking] = useState(true)
  const [fuelPriority, setFuelPriority] = useState(70)
  const [timePriority, setTimePriority] = useState(80)
  const [emissionsPriority, setEmissionsPriority] = useState(60)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRequest | null>(null)
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [realTimeUpdates, setRealTimeUpdates] = useState(true)
  const [weatherAlerts, setWeatherAlerts] = useState<string[]>([])
  const [trafficAlerts, setTrafficAlerts] = useState<string[]>([])

  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([
    {
      id: "D1",
      customer: "BuildWell Constructions",
      location: "MG Road, Bangalore",
      materials: ["TMT Steel Rods (3 tons)", "Cement (100 bags)"],
      priority: "urgent",
      requestedTime: "2024-01-15 10:00",
      estimatedDuration: 45,
      distance: 15,
      fuelCost: 220,
      status: "in-transit",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      contactNumber: "+91 98765 43210",
      deliveryType: "delivery",
      weight: 3500,
      volume: 12,
      specialRequirements: ["Crane required", "Site access before 6 PM"],
      assignedVehicle: "KA-01-AB-1234",
      assignedDriver: "Rajesh Kumar",
      estimatedArrival: "10:30 AM",
      rating: 4.8,
      weatherImpact: "low",
      trafficImpact: "medium",
      aiConfidence: 92,
      optimalRoute: ["Warehouse", "MG Road", "Construction Site"],
      alternativeRoutes: [["Warehouse", "Alternative Route", "MG Road", "Construction Site"]]
    },
    {
      id: "D2",
      customer: "Skyline Developers",
      location: "Whitefield, Bangalore",
      materials: ["Steel Beams (2 tons)", "Binding Wire (50 kg)"],
      priority: "high",
      requestedTime: "2024-01-15 11:30",
      estimatedDuration: 60,
      distance: 22,
      fuelCost: 280,
      status: "assigned",
      coordinates: { lat: 12.9698, lng: 77.7500 },
      contactNumber: "+91 87654 32109",
      deliveryType: "delivery",
      weight: 2050,
      volume: 8,
      specialRequirements: ["Morning delivery preferred"],
      assignedVehicle: "KA-02-CD-5678",
      assignedDriver: "Suresh Singh",
      estimatedArrival: "11:45 AM",
      rating: 4.6,
      weatherImpact: "medium",
      trafficImpact: "high",
      aiConfidence: 87,
      optimalRoute: ["Warehouse", "Whitefield Main Road", "Skyline Site"],
      alternativeRoutes: [["Warehouse", "ITPL Road", "Whitefield", "Skyline Site"]]
    },
    {
      id: "D3",
      customer: "Green Homes Ltd",
      location: "Electronic City, Bangalore",
      materials: ["TMT Steel Rods (2 tons)"],
      priority: "medium",
      requestedTime: "2024-01-15 14:00",
      estimatedDuration: 55,
      distance: 18,
      fuelCost: 250,
      status: "pending",
      coordinates: { lat: 12.8496, lng: 77.6760 },
      contactNumber: "+91 76543 21098",
      deliveryType: "delivery",
      weight: 2000,
      volume: 7,
      specialRequirements: ["Weekend delivery available"]
    },
    {
      id: "D4",
      customer: "Urban Infrastructure",
      location: "Koramangala, Bangalore",
      materials: ["Cement (200 bags)"],
      priority: "high",
      requestedTime: "2024-01-15 09:30",
      estimatedDuration: 35,
      distance: 12,
      fuelCost: 150,
      status: "delivered",
      coordinates: { lat: 12.9352, lng: 77.6245 },
      contactNumber: "+91 65432 10987",
      deliveryType: "delivery",
      weight: 10000,
      volume: 15,
      actualArrival: "09:35 AM",
      rating: 5.0,
      feedback: "Excellent service, on-time delivery"
    },
    {
      id: "D5",
      customer: "Steel Warehouse",
      location: "Yeshwanthpur Industrial Area",
      materials: ["TMT Steel Rods (5 tons)", "Steel Beams (2 tons)"],
      priority: "urgent",
      requestedTime: "2024-01-15 08:00",
      estimatedDuration: 30,
      distance: 12,
      fuelCost: 180,
      status: "delivered",
      coordinates: { lat: 13.0289, lng: 77.5459 },
      contactNumber: "+91 98765 43211",
      deliveryType: "pickup",
      weight: 7000,
      volume: 20,
      actualArrival: "08:15 AM",
      rating: 4.9,
      feedback: "Quick pickup, professional service"
    }
  ])

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "V1",
      registration: "KA-01-AB-1234",
      type: "truck",
      capacity: { weight: 10000, volume: 25 },
      fuelEfficiency: 8.5,
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      status: "in-use",
      driver: "Rajesh Kumar",
      lastMaintenance: "2024-01-01",
      nextMaintenance: "2024-02-01",
      fuelLevel: 75,
      telematicsData: {
        speed: 45,
        engineTemp: 85,
        fuelConsumption: 12.3,
        tirePressure: [32, 31, 33, 32]
      }
    },
    {
      id: "V2",
      registration: "KA-02-CD-5678",
      type: "truck",
      capacity: { weight: 8000, volume: 20 },
      fuelEfficiency: 9.2,
      currentLocation: { lat: 12.9698, lng: 77.7500 },
      status: "available",
      driver: "Suresh Singh",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-02-05",
      fuelLevel: 90,
      telematicsData: {
        speed: 0,
        engineTemp: 25,
        fuelConsumption: 0,
        tirePressure: [33, 32, 34, 33]
      }
    },
    {
      id: "V3",
      registration: "KA-03-EF-9012",
      type: "van",
      capacity: { weight: 3000, volume: 12 },
      fuelEfficiency: 12.5,
      currentLocation: { lat: 12.8496, lng: 77.6760 },
      status: "available",
      driver: "Amit Sharma",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      fuelLevel: 65,
      telematicsData: {
        speed: 0,
        engineTemp: 20,
        fuelConsumption: 0,
        tirePressure: [35, 34, 35, 34]
      }
    }
  ])

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: "AI1",
      type: "weather",
      title: "Rain Expected in 2 Hours",
      description: "Light rain expected in Whitefield area. Consider covering steel materials.",
      impact: "negative",
      confidence: 85,
      recommendedAction: "Use waterproof covers for steel deliveries",
      estimatedSavings: { time: 30, fuel: 0, cost: 500 }
    },
    {
      id: "AI2",
      type: "traffic",
      title: "Traffic Congestion on MG Road",
      description: "Heavy traffic reported on MG Road. Alternative route recommended.",
      impact: "negative",
      confidence: 92,
      recommendedAction: "Use Inner Ring Road instead",
      estimatedSavings: { time: 15, fuel: 2, cost: 150 }
    },
    {
      id: "AI3",
      type: "fuel",
      title: "Fuel Price Optimization",
      description: "Fuel prices lower at BPCL station on Airport Road.",
      impact: "positive",
      confidence: 78,
      recommendedAction: "Refuel vehicles at recommended station",
      estimatedSavings: { time: 0, fuel: 0, cost: 800 }
    },
    {
      id: "AI4",
      type: "efficiency",
      title: "Route Optimization Available",
      description: "AI analysis shows 12% improvement possible for current routes.",
      impact: "positive",
      confidence: 94,
      recommendedAction: "Run AI optimization algorithm",
      estimatedSavings: { time: 25, fuel: 8, cost: 1200 }
    }
  ])

  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([
    {
      id: "OR1",
      name: "Morning Delivery Route",
      deliveries: [],
      totalDistance: 67,
      estimatedTime: 190,
      fuelCost: 930,
      efficiency: 92,
      status: "active",
      driver: "Rajesh Kumar",
      vehicle: "KA-01-AB-1234",
      vehicleType: "truck",
      startTime: "08:00 AM",
      optimizationLevel: "ai-enhanced",
      savings: {
        time: 25,
        fuel: 85,
        cost: 1200
      },
      emissions: {
        co2: 145,
        nox: 2.3,
        pm25: 0.8
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
      case "delivered": return "default"
      case "in-transit": return "secondary"
      case "assigned": return "outline"
      case "pending": return "outline"
      case "cancelled": return "destructive"
      default: return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-transit": return <Truck className="h-4 w-4 text-blue-500" />
      case "assigned": return <Navigation className="h-4 w-4 text-yellow-500" />
      case "pending": return <Clock className="h-4 w-4 text-gray-500" />
      case "cancelled": return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const runOptimization = async () => {
    setIsOptimizing(true)
    // Simulate AI optimization
    setTimeout(() => {
      setOptimizedRoutes(prev => prev.map(route => 
        route.id === "OR1" ? {
          ...route,
          efficiency: Math.min(100, route.efficiency + Math.random() * 8),
          fuelCost: Math.round(route.fuelCost * (0.85 + Math.random() * 0.1)),
          estimatedTime: Math.round(route.estimatedTime * (0.9 + Math.random() * 0.05)),
          savings: {
            time: route.savings.time + Math.round(Math.random() * 10),
            fuel: route.savings.fuel + Math.round(Math.random() * 20),
            cost: route.savings.cost + Math.round(Math.random() * 200)
          },
          emissions: {
            co2: Math.round(route.emissions.co2 * (0.9 + Math.random() * 0.05)),
            nox: Math.round(route.emissions.nox * (0.92 + Math.random() * 0.03) * 10) / 10,
            pm25: Math.round(route.emissions.pm25 * (0.88 + Math.random() * 0.04) * 10) / 10
          }
        } : route
      ))
      setIsOptimizing(false)
    }, 3000)
  }

  const updateDeliveryStatus = (deliveryId: string, newStatus: string) => {
    setDeliveryRequests(prev => prev.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: newStatus as any } : delivery
    ))
  }

  const viewDeliveryDetails = (delivery: DeliveryRequest) => {
    setSelectedDelivery(delivery)
    setShowDeliveryDetails(true)
  }

  const getAIInsightIcon = (type: string) => {
    switch (type) {
      case "weather": return <Cloud className="h-4 w-4" />
      case "traffic": return <Route className="h-4 w-4" />
      case "fuel": return <Fuel className="h-4 w-4" />
      case "efficiency": return <Target className="h-4 w-4" />
      case "maintenance": return <Settings className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-green-600 bg-green-50 border-green-200"
      case "negative": return "text-red-600 bg-red-50 border-red-200"
      case "neutral": return "text-gray-600 bg-gray-50 border-gray-200"
      default: return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const simulateRealTimeUpdates = () => {
    if (!realTimeUpdates) return
    
    // Simulate traffic updates
    const trafficUpdate = Math.random() > 0.8
    if (trafficUpdate) {
      setTrafficAlerts(prev => [...prev, `Traffic congestion detected on Route ${Math.floor(Math.random() * 5) + 1}`])
    }
    
    // Simulate weather updates
    const weatherUpdate = Math.random() > 0.9
    if (weatherUpdate) {
      setWeatherAlerts(prev => [...prev, `Weather alert: Light rain expected in ${['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)]} zone`])
    }
    
    // Simulate delivery status updates
    setDeliveryRequests(prev => prev.map(delivery => {
      if (delivery.status === "in-transit" && Math.random() > 0.95) {
        return { ...delivery, status: "delivered", actualArrival: new Date().toLocaleTimeString() }
      }
      if (delivery.status === "assigned" && Math.random() > 0.9) {
        return { ...delivery, status: "in-transit" }
      }
      return delivery
    }))
  }

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(simulateRealTimeUpdates, 5000)
    return () => clearInterval(interval)
  }, [realTimeUpdates])

  const filteredDeliveries = deliveryRequests.filter(delivery => {
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || delivery.priority === filterPriority
    const matchesStatus = filterStatus === "all" || delivery.status === filterStatus
    return matchesSearch && matchesPriority && matchesStatus
  })

  const currentRoute = optimizedRoutes[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-yellow-300" />
              <div>
                <h1 className="text-2xl font-bold">Delivery Optimizer</h1>
                <p className="text-green-100">AI-powered delivery optimization and tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Brain className="h-4 w-4 text-yellow-300" />
                <span>AI Optimization</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-blue-300" />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-purple-300" />
                <span>Eco-Friendly</span>
              </div>
              <div className="flex items-center gap-1">
                <Bot className="h-4 w-4 text-cyan-300" />
                <span>{aiInsights.length} AI Insights</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowAIInsights(true)}>
              <Brain className="h-4 w-4 mr-2" />
              AI Insights ({aiInsights.length})
            </Button>
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
              {isOptimizing ? "Optimizing..." : "Optimize Deliveries"}
            </Button>
          </div>
        </div>
        
        {/* Real-time Alerts */}
        {(weatherAlerts.length > 0 || trafficAlerts.length > 0) && (
          <div className="mt-4 space-y-2">
            {weatherAlerts.map((alert, index) => (
              <Alert key={`weather-${index}`} className="bg-yellow-50 border-yellow-200">
                <Cloud className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">{alert}</AlertDescription>
              </Alert>
            ))}
            {trafficAlerts.map((alert, index) => (
              <Alert key={`traffic-${index}`} className="bg-orange-50 border-orange-200">
                <Route className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex space-x-1">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "deliveries", label: "Deliveries", icon: Truck },
            { id: "optimization", label: "AI Optimization", icon: Brain },
            { id: "analytics", label: "Analytics", icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{deliveryRequests.filter(d => d.status !== "delivered" && d.status !== "cancelled").length}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{deliveryRequests.filter(d => d.status === "delivered").length}</div>
                <p className="text-xs text-muted-foreground">Deliveries</p>
                <Progress value={90} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
                <Fuel className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">12.5</div>
                <p className="text-xs text-muted-foreground">km/L</p>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">4.8</div>
                <p className="text-xs text-muted-foreground">Average</p>
                <Progress value={96} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* AI Optimization Benefits */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Sparkles className="h-5 w-5" />
                AI Optimization Benefits
              </CardTitle>
              <CardDescription className="text-green-700">
                Smart savings and environmental benefits achieved through AI-powered delivery optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{currentRoute.savings.time} min</p>
                  <p className="text-sm text-green-700">Time Saved</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                  <div className="flex items-center justify-center mb-2">
                    <Fuel className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{currentRoute.savings.fuel} L</p>
                  <p className="text-sm text-green-700">Fuel Saved</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-6 w-6 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">₹{currentRoute.savings.cost}</p>
                  <p className="text-sm text-green-700">Cost Saved</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-green-100">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{currentRoute.emissions.co2} kg</p>
                  <p className="text-sm text-green-700">CO₂ Reduced</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Recent Deliveries
              </CardTitle>
              <CardDescription>Latest delivery requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryRequests.slice(0, 3).map((delivery) => (
                  <div key={delivery.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(delivery.status)}
                        <div>
                          <h4 className="font-medium">{delivery.customer}</h4>
                          <p className="text-sm text-muted-foreground">{delivery.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(delivery.status)}>
                          {delivery.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{delivery.priority.toUpperCase()}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Requested Time</p>
                        <p className="font-medium">{delivery.requestedTime.split(' ')[1]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="font-medium">{delivery.distance} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Duration</p>
                        <p className="font-medium">{delivery.estimatedDuration} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Cost</p>
                        <p className="font-medium">₹{delivery.fuelCost}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {delivery.coordinates.lat.toFixed(4)}, {delivery.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {delivery.status === "pending" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateDeliveryStatus(delivery.id, "assigned")}
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deliveries Tab */}
      {activeTab === "deliveries" && (
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Delivery Filters
              </CardTitle>
              <CardDescription>Filter and search delivery requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Search</Label>
                  <Input
                    placeholder="Search by customer or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
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
                <div>
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => {setSearchTerm(""); setFilterPriority("all"); setFilterStatus("all")}} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Requests ({filteredDeliveries.length})
              </CardTitle>
              <CardDescription>All delivery requests and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDeliveries.map((delivery) => (
                  <div key={delivery.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(delivery.status)}
                        <div>
                          <h4 className="font-medium">{delivery.customer}</h4>
                          <p className="text-sm text-muted-foreground">{delivery.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(delivery.status)}>
                          {delivery.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{delivery.priority.toUpperCase()}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Requested Time</p>
                        <p className="font-medium">{delivery.requestedTime.split(' ')[1]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="font-medium">{delivery.distance} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Duration</p>
                        <p className="font-medium">{delivery.estimatedDuration} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Cost</p>
                        <p className="font-medium">₹{delivery.fuelCost}</p>
                      </div>
                    </div>

                    {delivery.materials && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Materials</p>
                        <div className="flex flex-wrap gap-1">
                          {delivery.materials.map((material, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {delivery.coordinates.lat.toFixed(4)}, {delivery.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {delivery.status === "pending" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateDeliveryStatus(delivery.id, "assigned")}
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                        {delivery.status === "assigned" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateDeliveryStatus(delivery.id, "in-transit")}
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Start Delivery
                          </Button>
                        )}
                        {delivery.status === "in-transit" && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateDeliveryStatus(delivery.id, "delivered")}
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
        </div>
      )}

      {/* AI Optimization Tab */}
      {activeTab === "optimization" && (
        <div className="space-y-6">
          {/* AI Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Optimization Controls
              </CardTitle>
              <CardDescription>Configure AI optimization parameters and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label>Eco Mode</Label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={ecoMode}
                      onChange={(e) => setEcoMode(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Enable eco-friendly optimization</span>
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
                <div>
                  <Label>Emissions Priority: {emissionsPriority}%</Label>
                  <Slider
                    value={[emissionsPriority]}
                    onValueChange={(value) => setEmissionsPriority(value[0])}
                    max={100}
                    min={0}
                    step={5}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={runOptimization} disabled={isOptimizing}>
                  {isOptimizing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  {isOptimizing ? "Optimizing..." : "Run AI Optimization"}
                </Button>
                <Button variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  View AI Insights
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Optimization Results
              </CardTitle>
              <CardDescription>Current optimization performance and savings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{currentRoute.savings.time} min</p>
                  <p className="text-sm text-green-700">Time Saved</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <Fuel className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{currentRoute.savings.fuel} L</p>
                  <p className="text-sm text-blue-700">Fuel Saved</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-6 w-6 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">₹{currentRoute.savings.cost}</p>
                  <p className="text-sm text-purple-700">Cost Saved</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{currentRoute.emissions.co2} kg</p>
                  <p className="text-sm text-green-700">CO₂ Reduced</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                <Clock className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <p className="text-xs text-muted-foreground">This month</p>
                <Progress value={94} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">4.8/5</div>
                <p className="text-xs text-muted-foreground">Average rating</p>
                <Progress value={96} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
                <Fuel className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">12.5 km/L</div>
                <p className="text-xs text-muted-foreground">Average efficiency</p>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">₹2,400</div>
                <p className="text-xs text-muted-foreground">This month</p>
                <Progress value={88} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Delivery Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Delivery Performance Trends
              </CardTitle>
              <CardDescription>Monthly delivery performance and efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-green-700">Delivery Success Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>On-time deliveries</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Successful deliveries</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Customer satisfaction</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-700">Operational Efficiency</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Route efficiency</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Vehicle utilization</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Driver productivity</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-purple-700">Environmental Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fuel savings</span>
                      <span className="font-medium">85L</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>CO₂ reduction</span>
                      <span className="font-medium">145kg</span>
                    </div>
                    <Progress value={90} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Eco-friendly routes</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Delivery Optimizer Settings</h3>
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
                  <span className="text-sm">Enable automatic delivery optimization</span>
                </div>
              </div>
              
              <div>
                <Label>Real-time Tracking</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={realTimeTracking}
                    onChange={(e) => setRealTimeTracking(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Enable real-time delivery tracking</span>
                </div>
              </div>
              
              <div>
                <Label>Eco Mode</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={ecoMode}
                    onChange={(e) => setEcoMode(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Enable eco-friendly optimization</span>
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

      {/* AI Insights Dialog */}
      <Dialog open={showAIInsights} onOpenChange={setShowAIInsights}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Insights Dashboard
            </DialogTitle>
            <DialogDescription>
              Real-time AI analysis and recommendations for delivery optimization
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${getImpactColor(insight.impact).split(' ')[1]}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAIInsightIcon(insight.type)}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{insight.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Confidence</p>
                        <p className="text-sm text-gray-600">{insight.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recommendation</p>
                        <p className="text-sm text-gray-600">{insight.recommendedAction}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estimated Savings</p>
                        <p className="text-sm text-green-600 font-medium">
                          ₹{insight.estimatedSavings?.cost || 0}
                          {insight.estimatedSavings?.time && ` (${insight.estimatedSavings.time} min)`}
                          {insight.estimatedSavings?.fuel && ` (${insight.estimatedSavings.fuel}L fuel)`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIInsights(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delivery Details Dialog */}
      <Dialog open={showDeliveryDetails} onOpenChange={setShowDeliveryDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the selected delivery
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Customer</p>
                        <p className="text-sm text-gray-600">{selectedDelivery.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-600">{selectedDelivery.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <Badge variant="outline" className={getStatusBadgeVariant(selectedDelivery.status)}>
                          {selectedDelivery.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Priority</p>
                        <Badge variant="outline">{selectedDelivery.priority.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Distance</p>
                        <p className="text-sm text-gray-600">{selectedDelivery.distance} km</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estimated Duration</p>
                        <p className="text-sm text-gray-600">{selectedDelivery.estimatedDuration} min</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fuel Cost</p>
                        <p className="text-sm text-gray-600">₹{selectedDelivery.fuelCost}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Requested Time</p>
                        <p className="text-sm text-gray-600">{selectedDelivery.requestedTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Weather Impact</p>
                        <p className="text-sm text-gray-600">{selectedDelivery.weatherImpact}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Traffic Impact</p>
                        <p className="text-sm text-gray-600">{selectedDelivery.trafficImpact}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">AI Confidence</p>
                        <p className="text-sm text-green-600 font-medium">{selectedDelivery.aiConfidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Coordinates</p>
                        <p className="text-sm text-gray-600">
                          {selectedDelivery.coordinates.lat.toFixed(4)}, {selectedDelivery.coordinates.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {selectedDelivery.materials && selectedDelivery.materials.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedDelivery.materials.map((material, index) => (
                          <Badge key={index} variant="secondary">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeliveryDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
