"use client"

import { useState, useEffect } from "react"
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
  ShoppingCart, 
  BarChart3, 
  Eye, 
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  Brain,
  Settings,
  Wrench,
  TrendingDown,
  MapPin,
  Calendar,
  MessageSquare,
  Bot,
  Sparkles,
  Compass,
  Building2,
  Plus
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Import Smart Tools
import SellerInventoryOptimizer from "@/components/smart-tools/seller-inventory-optimizer"
import SellerPricingOptimizer from "@/components/smart-tools/seller-pricing-optimizer"
import ConstructionPlanning from "@/components/smart-tools/construction-planning"

export default function SellerDashboard() {
  const [totalRevenue] = useState(1250000)
  const [activeOrders] = useState(24)
  const [inventoryValue] = useState(850000)
  const [customerRating] = useState(4.7)
  const [lowStockAlerts] = useState(5)
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  // Business insights
  const [businessInsights] = useState([
    {
      id: 1,
      type: "revenue_growth",
      title: "Revenue Growth Opportunity",
      description: "Steel demand up 25% in your area. Consider increasing inventory.",
      potential_gain: "₹2,50,000",
      urgency: "high"
    },
    {
      id: 2,
      type: "seasonal_trend",
      title: "Seasonal Trend Alert",
      description: "Monsoon season approaching. Cement demand expected to rise 40%.",
      potential_gain: "₹1,80,000",
      urgency: "medium"
    },
    {
      id: 3,
      type: "competitor_analysis",
      title: "Competitor Price Analysis",
      description: "Your cement prices are 5% above market average.",
      potential_gain: "₹95,000",
      urgency: "low"
    }
  ])

  return (
    <div className="space-y-6">
      {/* Welcome Section - Simplified to avoid duplication with sidebar */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-green-200" />
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Supplier'}</h1>
                <p className="text-green-100">Your AI-powered business assistant is ready</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>AI Business Insights</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-300" />
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Notifications are handled by EnhancedNotificationCenter in sidebar */}
            <Link href="/dashboard/seller/inventory">
              <Button variant="secondary">
                <Package className="h-4 w-4 mr-2" />
                Inventory
              </Button>
            </Link>
            <Link href="/dashboard/seller/orders">
              <Button variant="secondary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders
              </Button>
            </Link>
            <Link href="/dashboard/seller/smart-tools">
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="smart-tools" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Smart Tools
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Stats Cards */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeOrders}</div>
                <p className="text-xs text-muted-foreground">5 pending confirmation</p>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{inventoryValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Current stock value</p>
                <Progress value={60} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerRating}</div>
                <p className="text-xs text-muted-foreground">Average rating</p>
                <Progress value={(customerRating / 5) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* AI Business Insights Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Business Insights
              </CardTitle>
              <CardDescription>Smart recommendations to grow your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessInsights.map((insight) => (
                  <div key={insight.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge 
                          variant={insight.urgency === 'high' ? 'destructive' : 
                                  insight.urgency === 'medium' ? 'secondary' : 'outline'}
                        >
                          {insight.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        Potential gain: {insight.potential_gain}
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
                  <Plus className="h-5 w-5" />
                  Quick Add Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-muted-foreground">Add new products to your inventory quickly</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Products:</span>
                    <span className="font-medium">{inventoryValue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Categories:</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
                <Link href="/dashboard/seller/add-product">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pricing Optimizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Optimal Prices:</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue Impact:</span>
                    <span className="font-medium text-green-600">+18%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Competitor Gap:</span>
                    <span className="font-medium">3%</span>
                  </div>
                </div>
                <Link href="/dashboard/seller/smart-tools/pricing-optimizer">
                  <Button variant="outline" className="w-full">
                    Optimize Pricing
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Route Optimizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fuel Savings:</span>
                    <span className="font-medium text-green-600">₹12,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time Saved:</span>
                    <span className="font-medium">15 hrs/month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
                <Link href="/dashboard/seller/smart-tools/route-optimizer">
                  <Button variant="outline" className="w-full">
                    Optimize Routes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Project Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Projects:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate:</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">On-time Delivery:</span>
                    <span className="font-medium">92%</span>
                  </div>
                </div>
                <Link href="/dashboard/seller/smart-tools/project-planning">
                  <Button variant="outline" className="w-full">
                    Plan Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders & Top Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "ORD-2024-001",
                      customer: "Reliable Builders",
                      items: "Cement, Steel",
                      amount: "₹1,25,000",
                      status: "Confirmed",
                    },
                    { 
                      id: "ORD-2024-002", 
                      customer: "Modern Construction", 
                      items: "Bricks, Sand", 
                      amount: "₹85,000", 
                      status: "Processing" 
                    },
                    {
                      id: "ORD-2024-003",
                      customer: "Green Homes Ltd.",
                      items: "Cement, Tiles",
                      amount: "₹1,50,000",
                      status: "Delivered",
                    },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items} • {order.amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Confirmed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/seller/orders">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Your most valuable customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Reliable Builders", orders: 45, total: "₹12.5L", rating: 4.9, badge: "Premium" },
                    { name: "Modern Construction", orders: 32, total: "₹8.2L", rating: 4.7, badge: "Regular" },
                    { name: "Green Homes Ltd.", orders: 28, total: "₹6.8L", rating: 4.8, badge: "Regular" },
                  ].map((customer) => (
                    <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{customer.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {customer.badge}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{customer.orders} orders</span>
                          <span>Total: {customer.total}</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {customer.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/seller/customers">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Customers
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders & Top Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "ORD-2024-001",
                      customer: "Reliable Builders",
                      items: "Cement, Steel",
                      amount: "₹1,25,000",
                      status: "Confirmed",
                    },
                    { 
                      id: "ORD-2024-002", 
                      customer: "Modern Construction", 
                      items: "Bricks, Sand", 
                      amount: "₹85,000", 
                      status: "Processing" 
                    },
                    {
                      id: "ORD-2024-003",
                      customer: "Green Homes Ltd.",
                      items: "Cement, Tiles",
                      amount: "₹1,50,000",
                      status: "Delivered",
                    },
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items} • {order.amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Confirmed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/seller/orders">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Your most valuable customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Reliable Builders", orders: 45, total: "₹12.5L", rating: 4.9, badge: "Premium" },
                    { name: "Modern Construction", orders: 32, total: "₹8.2L", rating: 4.7, badge: "Regular" },
                    { name: "Green Homes Ltd.", orders: 28, total: "₹6.8L", rating: 4.8, badge: "Regular" },
                  ].map((customer) => (
                    <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{customer.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {customer.badge}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{customer.orders} orders</span>
                          <span>Total: {customer.total}</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {customer.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/seller/customers">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Customers
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab with Smart Tools */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <p className="text-muted-foreground">Track and manage your product inventory</p>
            </div>
            <Link href="/dashboard/seller/add-product">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Current Stock
                </CardTitle>
                <CardDescription>View your current inventory levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Inventory data will be displayed here</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/dashboard/seller/inventory">View Full Inventory</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Stock Alerts
                </CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Steel Rods (16mm)", current: 50, reorder: 100, urgency: "high" },
                    { item: "Cement Bags (50kg)", current: 200, reorder: 300, urgency: "medium" },
                    { item: "Red Bricks", current: 15000, reorder: 20000, urgency: "low" },
                    { item: "Sand (tons)", current: 80, reorder: 120, urgency: "medium" }
                  ].map((alert) => (
                    <div key={alert.item} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{alert.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {alert.current} • Reorder: {alert.reorder}
                        </p>
                      </div>
                      <Badge 
                        variant={alert.urgency === 'high' ? 'destructive' : 
                                alert.urgency === 'medium' ? 'secondary' : 'outline'}
                      >
                        {alert.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹4,25,000</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Order Volume</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{activeOrders}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <p className="text-xs text-muted-foreground">+3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <Target className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">18.5%</div>
                <p className="text-xs text-muted-foreground">+2.3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>Monthly revenue over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "January", revenue: 385000, target: 400000 },
                    { month: "February", revenue: 412000, target: 420000 },
                    { month: "March", revenue: 445000, target: 450000 },
                    { month: "April", revenue: 398000, target: 410000 },
                    { month: "May", revenue: 425000, target: 430000 },
                    { month: "June", revenue: 467000, target: 460000 }
                  ].map((item) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.revenue >= item.target ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min((item.revenue / item.target) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ₹{item.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Top Products
                </CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { product: "Cement Bags (50kg)", sales: 850, revenue: 357000, growth: "+12%" },
                    { product: "Steel Rods (16mm)", sales: 420, revenue: 273000, growth: "+8%" },
                    { product: "Red Bricks", sales: 25000, revenue: 200000, growth: "+15%" },
                    { product: "Sand (tons)", sales: 180, revenue: 144000, growth: "+5%" }
                  ].map((product) => (
                    <div key={product.product} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{product.product}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sales.toLocaleString()} units • ₹{product.revenue.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {product.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* AI Business Insights */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI Business Insights
                </CardTitle>
                <CardDescription>Smart recommendations to grow your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessInsights.map((insight) => (
                    <div key={insight.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge 
                            variant={insight.urgency === 'high' ? 'destructive' : 
                                    insight.urgency === 'medium' ? 'secondary' : 'outline'}
                          >
                            {insight.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          Potential gain: {insight.potential_gain}
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

            {/* Market Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Steel Demand</span>
                    <Badge variant="outline" className="text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +25%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cement Prices</span>
                    <Badge variant="outline" className="text-red-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Brick Supply</span>
                    <Badge variant="outline" className="text-gray-600">
                      → 0%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Smart Tools Tab - Integrated Tools */}
        <TabsContent value="smart-tools" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Inventory Optimizer Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Optimizer
                </CardTitle>
                <CardDescription>AI-driven inventory management and demand forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <SellerInventoryOptimizer />
              </CardContent>
            </Card>

            {/* Pricing Optimizer Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pricing Optimizer
                </CardTitle>
                <CardDescription>Smart pricing based on market analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <SellerPricingOptimizer />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Construction Planning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Project Planning
                </CardTitle>
                <CardDescription>AI-powered project planning and resource allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <ConstructionPlanning />
              </CardContent>
            </Card>

            {/* Route Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Delivery Optimization
                </CardTitle>
                <CardDescription>Optimize delivery routes and scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Route Efficiency</p>
                      <p className="text-sm text-muted-foreground">94% optimized</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">94%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Fuel Savings</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">₹12,500</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Time Saved</p>
                      <p className="text-sm text-muted-foreground">Per delivery</p>
                    </div>
                    <Badge variant="outline" className="text-blue-600">25 min</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Optimize Routes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-time Delivery</CardTitle>
                <Clock className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">96%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">4.8</div>
                <p className="text-xs text-muted-foreground">+0.2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Order Accuracy</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <p className="text-xs text-muted-foreground">+1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">2.5h</div>
                <p className="text-xs text-muted-foreground">-0.5h from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: "Order Processing Time", current: "2.1h", target: "2h", status: "good" },
                    { metric: "Inventory Turnover", current: "8.2x", target: "8x", status: "excellent" },
                    { metric: "Customer Retention", current: "89%", target: "85%", status: "excellent" },
                    { metric: "Return Rate", current: "1.2%", target: "2%", status: "excellent" }
                  ].map((item) => (
                    <div key={item.metric} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.metric}</p>
                        <p className="text-sm text-muted-foreground">Target: {item.target}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.current}</p>
                        <Badge 
                          variant={item.status === 'excellent' ? 'default' : 
                                  item.status === 'good' ? 'secondary' : 'outline'}
                          className={item.status === 'excellent' ? 'bg-green-500' : 
                                    item.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'}
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals & Targets
                </CardTitle>
                <CardDescription>Monthly performance targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { goal: "Monthly Revenue", current: 425000, target: 450000, unit: "₹" },
                    { goal: "New Customers", current: 28, target: 30, unit: "" },
                    { goal: "Order Accuracy", current: 98, target: 99, unit: "%" },
                    { goal: "Response Time", current: 2.5, target: 2, unit: "h" }
                  ].map((goal) => (
                    <div key={goal.goal} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{goal.goal}</span>
                        <span className="text-sm text-muted-foreground">
                          {goal.unit}{goal.current.toLocaleString()} / {goal.unit}{goal.target.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(goal.current / goal.target) * 100} 
                        className={goal.current >= goal.target ? 'bg-green-500' : 'bg-blue-500'}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


