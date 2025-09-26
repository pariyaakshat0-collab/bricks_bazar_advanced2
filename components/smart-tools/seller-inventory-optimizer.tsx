"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  BarChart3,
  Eye,
  Target,
  Calendar,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Search,
  Plus,
  Minus,
  Wrench,
  Cloud,
  Thermometer,
  Users,
  Truck,
  TrendingDown,
  Activity,
  PieChart,
  BarChart2,
  Lightbulb,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Brain
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  optimalStock: number
  reorderPoint: number
  demandForecast: number
  price: number
  lastUpdated: string
  status: "optimal" | "low" | "excess" | "critical"
  aiRecommendation: string
  supplier: string
  leadTime: number
  storageCost: number
  turnoverRate: number
  profitMargin: number
  weatherImpact: number
  seasonalDemand: number
  aiConfidence: number
  alternativeSuppliers: string[]
  marketTrend: "rising" | "stable" | "falling"
  costTrend: "rising" | "stable" | "falling"
}

interface AIInsight {
  id: string
  type: "weather" | "seasonal" | "market" | "supplier" | "optimization"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  confidence: number
  recommendation: string
  estimatedSavings: number
  affectedItems: string[]
}

interface OptimizationSettings {
  safetyStockLevel: number
  reorderThreshold: number
  demandForecastPeriod: number
  costOptimization: boolean
  leadTimeOptimization: boolean
}

export default function SellerInventoryOptimizer() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Steel Rods (16mm)",
      category: "Steel",
      currentStock: 50,
      optimalStock: 120,
      reorderPoint: 100,
      demandForecast: 85,
      price: 65000,
      lastUpdated: "2024-01-15",
      status: "critical",
      aiRecommendation: "Urgent restock needed. Demand expected to rise 25% next week.",
      supplier: "SteelCorp Industries",
      leadTime: 7,
      storageCost: 2500,
      turnoverRate: 8.2,
      profitMargin: 18,
      weatherImpact: 0.8,
      seasonalDemand: 1.25,
      aiConfidence: 0.92,
      alternativeSuppliers: ["Tata Steel", "JSW Steel", "SAIL"],
      marketTrend: "rising",
      costTrend: "rising"
    },
    {
      id: "2",
      name: "Cement Bags (50kg)",
      category: "Cement",
      currentStock: 200,
      optimalStock: 350,
      reorderPoint: 300,
      demandForecast: 280,
      price: 420,
      lastUpdated: "2024-01-14",
      status: "low",
      aiRecommendation: "Reorder recommended. Monsoon season approaching.",
      supplier: "UltraTech Cement",
      leadTime: 5,
      storageCost: 1800,
      turnoverRate: 6.8,
      profitMargin: 22,
      weatherImpact: 0.9,
      seasonalDemand: 1.4,
      aiConfidence: 0.87,
      alternativeSuppliers: ["Ambuja Cement", "ACC Cement", "Shree Cement"],
      marketTrend: "stable",
      costTrend: "rising"
    },
    {
      id: "3",
      name: "Red Bricks",
      category: "Bricks",
      currentStock: 15000,
      optimalStock: 20000,
      reorderPoint: 18000,
      demandForecast: 16500,
      price: 8,
      lastUpdated: "2024-01-13",
      status: "low",
      aiRecommendation: "Consider bulk purchase for cost savings.",
      supplier: "Local Brick Works",
      leadTime: 3,
      storageCost: 3200,
      turnoverRate: 9.1,
      profitMargin: 15,
      weatherImpact: 0.3,
      seasonalDemand: 0.8,
      aiConfidence: 0.85,
      alternativeSuppliers: ["BrickCorp", "Quality Bricks", "Local Supply"],
      marketTrend: "stable",
      costTrend: "stable"
    },
    {
      id: "4",
      name: "Concrete Blocks",
      category: "Blocks",
      currentStock: 800,
      optimalStock: 750,
      reorderPoint: 600,
      demandForecast: 720,
      price: 45,
      lastUpdated: "2024-01-12",
      status: "optimal",
      aiRecommendation: "Stock levels optimal. Monitor demand trends.",
      supplier: "BuildBlock Industries",
      leadTime: 4,
      storageCost: 1200,
      turnoverRate: 7.5,
      profitMargin: 20,
      weatherImpact: 0.1,
      seasonalDemand: 0.7,
      aiConfidence: 0.92,
      alternativeSuppliers: ["BlockCorp", "Concrete Plus", "BuildMart"],
      marketTrend: "stable",
      costTrend: "stable"
    },
    {
      id: "5",
      name: "Sand (tons)",
      category: "Aggregates",
      currentStock: 80,
      optimalStock: 120,
      reorderPoint: 100,
      demandForecast: 95,
      price: 1200,
      lastUpdated: "2024-01-11",
      status: "low",
      aiRecommendation: "Stock up for upcoming construction season.",
      supplier: "River Sand Suppliers",
      leadTime: 6,
      storageCost: 2800,
      turnoverRate: 5.9,
      profitMargin: 12,
      weatherImpact: 0.6,
      seasonalDemand: 0.9,
      aiConfidence: 0.88,
      alternativeSuppliers: ["Desert Sand Co", "Aggregate Plus", "Sand Supply Inc"],
      marketTrend: "rising",
      costTrend: "rising"
    },
    {
      id: "6",
      name: "Tiles (Ceramic)",
      category: "Finishing",
      currentStock: 450,
      optimalStock: 400,
      reorderPoint: 300,
      demandForecast: 380,
      price: 85,
      lastUpdated: "2024-01-10",
      status: "excess",
      aiRecommendation: "Consider promotional pricing to reduce excess stock.",
      supplier: "TileMaster Corp",
      leadTime: 8,
      storageCost: 2200,
      turnoverRate: 4.2,
      profitMargin: 25,
      weatherImpact: 0.3,
      seasonalDemand: 0.7,
      aiConfidence: 0.85,
      alternativeSuppliers: ["Ceramic Pro", "Tile World", "Design Tiles"],
      marketTrend: "stable",
      costTrend: "stable"
    }
  ])

  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    safetyStockLevel: 20,
    reorderThreshold: 80,
    demandForecastPeriod: 30,
    costOptimization: true,
    leadTimeOptimization: true
  })

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [showItemDetails, setShowItemDetails] = useState(false)
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([])
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [realTimeUpdates, setRealTimeUpdates] = useState(true)
  const [marketAlerts, setMarketAlerts] = useState<string[]>([])

  const categories = ["all", "Steel", "Cement", "Bricks", "Blocks", "Aggregates", "Finishing"]

  // Initialize AI insights
  useEffect(() => {
    const insights: AIInsight[] = [
      {
        id: "1",
        type: "weather",
        title: "Monsoon Impact Alert",
        description: "Heavy rainfall expected next week affecting cement demand and storage",
        impact: "high",
        confidence: 0.89,
        recommendation: "Increase cement stock by 20% and ensure proper storage coverage",
        estimatedSavings: 45000,
        affectedItems: ["Cement Bags (50kg)", "Sand (tons)"]
      },
      {
        id: "2",
        type: "seasonal",
        title: "Construction Season Peak",
        description: "Pre-monsoon construction rush expected to drive steel demand up 25%",
        impact: "high",
        confidence: 0.92,
        recommendation: "Stock up on steel products before price surge",
        estimatedSavings: 125000,
        affectedItems: ["Steel Rods (16mm)"]
      },
      {
        id: "3",
        type: "market",
        title: "Steel Price Volatility",
        description: "Steel prices showing 8% volatility due to global market conditions",
        impact: "medium",
        confidence: 0.78,
        recommendation: "Consider alternative suppliers or forward contracts",
        estimatedSavings: 85000,
        affectedItems: ["Steel Rods (16mm)"]
      },
      {
        id: "4",
        type: "optimization",
        title: "Excess Tile Inventory",
        description: "Ceramic tiles showing 12% excess stock above optimal levels",
        impact: "low",
        confidence: 0.95,
        recommendation: "Implement promotional pricing to clear excess stock",
        estimatedSavings: 25000,
        affectedItems: ["Tiles (Ceramic)"]
      }
    ]
    setAIInsights(insights)
  }, [])

  const viewItemDetails = (item: InventoryItem) => {
    setSelectedItem(item)
    setShowItemDetails(true)
  }

  const getAIInsightIcon = (type: string) => {
    switch (type) {
      case "weather": return Cloud
      case "seasonal": return Calendar
      case "market": return TrendingUp
      case "supplier": return Truck
      case "optimization": return Lightbulb
      default: return AlertCircle
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-500 bg-red-50"
      case "medium": return "text-yellow-500 bg-yellow-50"
      case "low": return "text-green-500 bg-green-50"
      default: return "text-gray-500 bg-gray-50"
    }
  }

  const simulateRealTimeUpdates = () => {
    if (!realTimeUpdates) return

    // Simulate market alerts
    const alerts = [
      "Steel prices up 2.5% due to supply chain disruption",
      "Cement demand surge detected in your region",
      "Weather alert: Heavy rainfall may affect delivery schedules",
      "New supplier offering 5% discount on bulk orders"
    ]
    
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)]
    setMarketAlerts(prev => [randomAlert, ...prev.slice(0, 2)])
  }

  useEffect(() => {
    const interval = setInterval(simulateRealTimeUpdates, 8000)
    return () => clearInterval(interval)
  }, [realTimeUpdates])

  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-green-500"
      case "low": return "bg-yellow-500"
      case "critical": return "bg-red-500"
      case "excess": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "optimal": return "default"
      case "low": return "secondary"
      case "critical": return "destructive"
      case "excess": return "outline"
      default: return "outline"
    }
  }

  const runOptimization = async () => {
    setIsOptimizing(true)
    // Simulate AI optimization
    setTimeout(() => {
      setInventoryItems(prev => prev.map(item => ({
        ...item,
        optimalStock: Math.round(item.demandForecast * (1 + optimizationSettings.safetyStockLevel / 100)),
        reorderPoint: Math.round(item.demandForecast * (optimizationSettings.reorderThreshold / 100))
      })))
      setIsOptimizing(false)
    }, 2000)
  }

  const generateReport = () => {
    // Simulate report generation
    console.log("Generating inventory optimization report...")
  }

  const updateStock = (itemId: string, newStock: number) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, currentStock: newStock } : item
    ))
  }

  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0)
  const totalOptimalValue = inventoryItems.reduce((sum, item) => sum + (item.optimalStock * item.price), 0)
  const totalMonthlySavings = inventoryItems.reduce((sum, item) => {
    const excessStock = Math.max(0, item.currentStock - item.optimalStock)
    return sum + (excessStock * item.storageCost)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header with AI Assistant */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-300" />
              <div>
                <h1 className="text-2xl font-bold">AI Inventory Optimizer</h1>
                <p className="text-blue-100">Smart inventory management powered by machine learning</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4 text-yellow-300" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-green-300" />
                <span>Predictive Forecasting</span>
              </div>
              <div className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4 text-orange-300" />
                <span>{aiInsights.length} AI Insights</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowAIInsights(true)}>
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
            <Button variant="secondary" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="secondary" onClick={generateReport}>
              <Download className="h-4 w-4 mr-2" />
              Report
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Market Alerts */}
      {marketAlerts.length > 0 && (
        <div className="space-y-2">
          {marketAlerts.map((alert, index) => (
            <Alert key={index} className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(totalInventoryValue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
            <Progress value={(totalInventoryValue / totalOptimalValue) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">92%</div>
            <p className="text-xs text-muted-foreground">AI optimization level</p>
            <Progress value={92} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{(totalMonthlySavings / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Cost optimization</p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventoryItems.filter(item => item.status === "critical").length}
            </div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
            <Progress 
              value={(inventoryItems.filter(item => item.status === "critical").length / inventoryItems.length) * 100} 
              className="mt-2 bg-red-500" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search inventory items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={runOptimization} disabled={isOptimizing}>
          {isOptimizing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          {isOptimizing ? "Optimizing..." : "Run AI Optimization"}
        </Button>
      </div>

      {/* Inventory Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Items
          </CardTitle>
          <CardDescription>AI-powered inventory management and optimization recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category} • {item.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {item.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">Margin: {item.profitMargin}%</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Stock</p>
                    <p className="font-medium">{item.currentStock.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Optimal Stock</p>
                    <p className="font-medium">{item.optimalStock.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reorder Point</p>
                    <p className="font-medium">{item.reorderPoint.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Turnover Rate</p>
                    <p className="font-medium">{item.turnoverRate}x/year</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Stock Level</span>
                    <span className="text-sm text-muted-foreground">
                      {item.currentStock}/{item.optimalStock}
                    </span>
                  </div>
                  <Progress 
                    value={(item.currentStock / item.optimalStock) * 100} 
                    className={getStatusColor(item.status)}
                  />
                </div>

                <Alert className="mb-3">
                  <Brain className="h-4 w-4" />
                  <AlertDescription>{item.aiRecommendation}</AlertDescription>
                </Alert>

                {/* AI Analysis */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Cloud className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                    <p className="text-xs text-muted-foreground">Weather Impact</p>
                    <p className="font-medium text-sm">{(item.weatherImpact * 100).toFixed(0)}%</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-4 w-4 mx-auto text-green-500 mb-1" />
                    <p className="text-xs text-muted-foreground">Seasonal Demand</p>
                    <p className="font-medium text-sm">{(item.seasonalDemand * 100).toFixed(0)}%</p>
                  </div>
                  <div className="text-center">
                    <Target className="h-4 w-4 mx-auto text-purple-500 mb-1" />
                    <p className="text-xs text-muted-foreground">AI Confidence</p>
                    <p className="font-medium text-sm">{(item.aiConfidence * 100).toFixed(0)}%</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-4 w-4 mx-auto text-orange-500 mb-1" />
                    <p className="text-xs text-muted-foreground">Market Trend</p>
                    <p className="font-medium text-sm capitalize">{item.marketTrend}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Lead: {item.leadTime} days
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Updated: {item.lastUpdated}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => updateStock(item.id, item.currentStock + 10)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => updateStock(item.id, Math.max(0, item.currentStock - 10))}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Wrench className="h-3 w-3 mr-1" />
                          Adjust
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adjust Stock Level</DialogTitle>
                          <DialogDescription>
                            Update the stock level for {item.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Current Stock: {item.currentStock}</Label>
                            <Input 
                              type="number" 
                              defaultValue={item.currentStock}
                              onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Optimization Settings</DialogTitle>
            <DialogDescription>
              Configure the AI optimization parameters
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>Safety Stock Level (%)</Label>
              <Slider
                value={[optimizationSettings.safetyStockLevel]}
                onValueChange={(value) => setOptimizationSettings(prev => ({ ...prev, safetyStockLevel: value[0] }))}
                max={50}
                min={0}
                step={5}
              />
              <p className="text-sm text-muted-foreground">Current: {optimizationSettings.safetyStockLevel}%</p>
            </div>
            <div>
              <Label>Reorder Threshold (%)</Label>
              <Slider
                value={[optimizationSettings.reorderThreshold]}
                onValueChange={(value) => setOptimizationSettings(prev => ({ ...prev, reorderThreshold: value[0] }))}
                max={100}
                min={50}
                step={5}
              />
              <p className="text-sm text-muted-foreground">Current: {optimizationSettings.reorderThreshold}%</p>
            </div>
            <div>
              <Label>Demand Forecast Period (days)</Label>
              <Select 
                value={optimizationSettings.demandForecastPeriod.toString()}
                onValueChange={(value) => setOptimizationSettings(prev => ({ ...prev, demandForecastPeriod: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
