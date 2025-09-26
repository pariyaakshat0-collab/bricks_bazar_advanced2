"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calculator,
  ShoppingCart,
  Truck,
  Star,
  TrendingUp,
  Package,
  MapPin,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  BarChart3,
  Brain,
  ArrowRight,
  MessageSquare,
  Bell,
  Zap,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  Sparkles,
  Bot,
  Wrench,
  Compass,
  Settings
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useNotification } from "@/components/shared/notification-provider"
import { EnhancedNotificationCenter } from "@/components/shared/enhanced-notification-center"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useOrders, useSuppliers } from "@/lib/hooks"

// Import Smart Tools
import ConstructionPlanning from "@/components/smart-tools/construction-planning"
import PriceComparison from "@/components/smart-tools/price-comparison"
import DeliveryOptimizer from "@/components/smart-tools/delivery-optimizer"
import EnhancedLocationCosting from "@/components/smart-tools/enhanced-location-costing"

export default function BuyerDashboard() {
  const [activeProjects] = useState(3)
  const [cartItems, setCartItems] = useState(0)
  const [cartValue, setCartValue] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  // Real API data hooks
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useOrders(undefined, 5)
  const { data: suppliersData, loading: suppliersLoading, error: suppliersError } = useSuppliers()

  const totalOrders = ordersData?.orders?.length || 0
  const totalSpent = ordersData?.orders?.reduce((sum: number, order: any) => {
    const budget = parseFloat(order.budget) || 0
    return sum + budget
  }, 0) || 0
  const avgRating = suppliersData?.suppliers?.reduce((sum: number, supplier: any) => {
    return sum + (supplier.rating || 0)
  }, 0) / (suppliersData?.suppliers?.length || 1) || 4.5

  // Smart tools integration
  const [costEstimator] = useState({
    recentProjects: 3,
    savedAmounts: "₹45,000",
    accuracy: "95%"
  })

  const [locationPricing] = useState([
    { material: "Red Bricks", local: "₹8/piece", regional: "₹6.5/piece", savings: "18%" },
    { material: "Cement (50kg)", local: "₹420/bag", regional: "₹380/bag", savings: "9%" },
    { material: "Steel Rods", local: "₹65/kg", regional: "₹58/kg", savings: "11%" },
  ])

  // AI-powered recommendations
  const [aiRecommendations] = useState([
    {
      id: 1,
      type: "bulk_discount",
      title: "Bulk Purchase Opportunity",
      description: "Save 15% by ordering 20% more cement this month",
      potential_savings: "₹12,500",
      urgency: "high"
    },
    {
      id: 2,
      type: "seasonal_alert",
      title: "Seasonal Price Alert",
      description: "Steel prices expected to rise 8% next month",
      potential_savings: "₹8,000",
      urgency: "medium"
    },
    {
      id: 3,
      type: "supplier_match",
      title: "New Supplier Match",
      description: "Perfect match found for your steel requirements",
      potential_savings: "₹5,500",
      urgency: "low"
    }
  ])

  const loadCartData = () => {
    const savedCart = localStorage.getItem(`cart_${user?.id}`)
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        const items = Object.values(cartData as Record<string, any>).reduce((sum, qty: number | { quantity: number }) => sum + (typeof qty === 'number' ? qty : qty.quantity || 0), 0)
        setCartItems(items)

        // Calculate cart value
        const mockPrices: Record<string, number> = {
          "1": 8.5, "2": 420, "3": 65
        }
        const value = Object.entries(cartData as Record<string, any>).reduce((sum, [id, qty]: [string, number | { quantity: number }]) => {
          const quantity = typeof qty === 'number' ? qty : qty.quantity || 0
          const price = mockPrices[id] || 0
          return sum + (price * quantity)
        }, 0)
        setCartValue(value)
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }

  useEffect(() => {
    loadCartData()
    // Set up cart update listener
    const handleCartUpdate = () => loadCartData()
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [user])

  return (
    <div className="space-y-6">
      {/* Welcome Section - Simplified to avoid duplication with sidebar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-blue-200" />
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Construction Manager'}</h1>
                <p className="text-blue-100">Your AI-powered construction assistant is ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>AI Recommendations Active</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-green-300" />
                <span>Real-time Pricing</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <EnhancedNotificationCenter />
            <Link href="/dashboard/buyer/cart">
              <Button variant="secondary" className="relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/dashboard/buyer/products">
              <Button variant="secondary">
                <Package className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
            <Link href="/dashboard/buyer/smart-tools">
              <Button variant="secondary">
                <Wrench className="h-4 w-4 mr-2" />
                Smart Tools
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="smart-tools" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Smart Tools
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Savings
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Projects
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Stats Cards */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-muted-foreground">2 starting this month</p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cartItems}</div>
                <p className="text-xs text-muted-foreground">₹{cartValue.toLocaleString()} value</p>
                <Progress value={Math.min((cartValue / 50000) * 100, 100)} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
                <Progress value={65} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supplier Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Average rating</p>
                <Progress value={(avgRating / 5) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>Smart insights to optimize your purchasing decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((recommendation) => (
                  <div key={recommendation.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{recommendation.title}</h4>
                        <Badge
                          variant={recommendation.urgency === 'high' ? 'destructive' :
                            recommendation.urgency === 'medium' ? 'secondary' : 'outline'}
                        >
                          {recommendation.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        Save {recommendation.potential_savings}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Smart Tools Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Cost Estimator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recent Projects:</span>
                    <span className="font-medium">{costEstimator.recentProjects}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Savings:</span>
                    <span className="font-medium text-green-600">{costEstimator.savedAmounts}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="font-medium">{costEstimator.accuracy}</span>
                  </div>
                </div>
                <Link href="/dashboard/buyer/smart-tools/cost-estimator">
                  <Button variant="outline" className="w-full">
                    Calculate Project Costs
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Delivery Optimizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Optimize delivery routes and reduce costs</p>
                <Link href="/dashboard/buyer/smart-tools/delivery-optimizer">
                  <Button variant="outline" className="w-full">
                    Optimize Delivery
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Price Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Compare prices across verified suppliers</p>
                <Link href="/dashboard/buyer/smart-tools/price-comparison">
                  <Button variant="outline" className="w-full">
                    Compare Prices
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Costing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Location-based cost calculations</p>
                <Link href="/dashboard/buyer/smart-tools/location-costing">
                  <Button variant="outline" className="w-full">
                    Calculate Costs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Smart Tools Tab - Integrated Tools */}
        <TabsContent value="smart-tools" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Construction Planning Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Construction Planning
                </CardTitle>
                <CardDescription>AI-powered project planning and cost estimation</CardDescription>
              </CardHeader>
              <CardContent>
                <ConstructionPlanning />
              </CardContent>
            </Card>

            {/* Price Comparison Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Smart Price Comparison
                </CardTitle>
                <CardDescription>Compare prices across verified suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <PriceComparison />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Delivery Optimizer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Optimizer
                </CardTitle>
                <CardDescription>Optimize delivery routes and timing</CardDescription>
              </CardHeader>
              <CardContent>
                <DeliveryOptimizer />
              </CardContent>
            </Card>

            {/* Enhanced Location Costing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location-Based Costing
                </CardTitle>
                <CardDescription>Precise cost calculation with location factors</CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedLocationCosting />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* AI Recommendations */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Smart suggestions based on your purchasing patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiRecommendations.map((rec) => (
                    <Alert key={rec.id} className={rec.urgency === 'high' ? 'border-purple-500' : ''}>
                      <Sparkles className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        {rec.title}
                        <Badge variant={rec.urgency === 'high' ? 'destructive' : 'secondary'}>
                          {rec.urgency.toUpperCase()}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="flex items-center justify-between mt-2">
                        <span>{rec.description}</span>
                        <Badge variant="outline" className="text-green-600">
                          Save {rec.potential_savings}
                        </Badge>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cement Prices</span>
                    <Badge variant="outline" className="text-green-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -5%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Steel Prices</span>
                    <Badge variant="outline" className="text-red-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Brick Prices</span>
                    <Badge variant="outline" className="text-gray-600">
                      → 0%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Savings Tab */}
        <TabsContent value="savings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹1,25,000</div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bulk Discounts</CardTitle>
                <Award className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">₹45,000</div>
                <p className="text-xs text-muted-foreground">From large orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Location Savings</CardTitle>
                <MapPin className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">₹38,000</div>
                <p className="text-xs text-muted-foreground">Regional suppliers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smart Timing</CardTitle>
                <Target className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">₹42,000</div>
                <p className="text-xs text-muted-foreground">Optimal timing</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Active Projects
                </CardTitle>
                <CardDescription>Your current construction projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Residential Complex", status: "In Progress", completion: 75, budget: "₹45L" },
                    { name: "Office Renovation", status: "Planning", completion: 25, budget: "₹15L" },
                    { name: "Warehouse Construction", status: "Completed", completion: 100, budget: "₹85L" }
                  ].map((project) => (
                    <div key={project.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{project.name}</span>
                        <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                      <Progress value={project.completion} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{project.completion}% Complete</span>
                        <span>Budget: {project.budget}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common project management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Order Materials
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Costs
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Business Overview - Consolidated Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Overview
          </CardTitle>
          <CardDescription>Recent orders, trusted suppliers, and location-based pricing insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="suppliers">Trusted Suppliers</TabsTrigger>
              <TabsTrigger value="pricing">Location Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-4 space-y-4">
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : ordersError ? (
                <div className="text-center py-4 text-red-500">
                  Error loading orders: {ordersError as string}
                </div>
              ) : (
                <div className="space-y-4">
                  {ordersData?.orders?.slice(0, 3).map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.quantity} {order.unit} • {order.materialType}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            order.status === "DELIVERED"
                              ? "default"
                              : order.status === "IN_TRANSIT"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/dashboard/buyer/orders">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Orders
                </Button>
              </Link>
            </TabsContent>

            <TabsContent value="suppliers" className="mt-4 space-y-4">
              {suppliersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : suppliersError ? (
                <div className="text-center py-4 text-red-500">
                  Error loading suppliers: {suppliersError as string}
                </div>
              ) : (
                <div className="space-y-4">
                  {suppliersData?.suppliers?.slice(0, 3).map((supplier: any) => (
                    <div key={supplier._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{supplier.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {supplier.isVerified ? 'Verified' : 'Local'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {supplier.rating || 4.5}
                          </span>
                          <span>{supplier.city}, {supplier.state}</span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {supplier.materials?.length || 0} materials
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/dashboard/buyer/suppliers">
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Suppliers
                </Button>
              </Link>
            </TabsContent>

            <TabsContent value="pricing" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {locationPricing.map((item) => (
                  <div key={item.material} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{item.material}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Local:</span>
                        <span>{item.local}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Regional:</span>
                        <span>{item.regional}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-green-600">Savings:</span>
                        <span className="text-green-600">{item.savings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}