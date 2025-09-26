"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package, 
  Truck, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Target,
  Zap,
  Award,
  Globe
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MetricData {
  value: number
  change: number
  trend: 'up' | 'down'
  label: string
}

interface ChartData {
  name: string
  value?: number
  [key: string]: any
}

const performanceData: ChartData[] = [
  { name: 'Jan', revenue: 45000, orders: 120, users: 850 },
  { name: 'Feb', revenue: 52000, orders: 145, users: 920 },
  { name: 'Mar', revenue: 48000, orders: 135, users: 890 },
  { name: 'Apr', revenue: 61000, orders: 165, users: 1020 },
  { name: 'May', revenue: 58000, orders: 158, users: 980 },
  { name: 'Jun', revenue: 67000, orders: 185, users: 1150 },
  { name: 'Jul', revenue: 72000, orders: 195, users: 1200 },
  { name: 'Aug', revenue: 69000, orders: 188, users: 1180 },
  { name: 'Sep', revenue: 75000, orders: 205, users: 1250 },
  { name: 'Oct', revenue: 78000, orders: 215, users: 1320 },
  { name: 'Nov', revenue: 82000, orders: 225, users: 1380 },
  { name: 'Dec', revenue: 89000, orders: 245, users: 1450 }
]

const categoryData: ChartData[] = [
  { name: 'Steel', value: 35, color: '#3B82F6' },
  { name: 'Concrete', value: 28, color: '#10B981' },
  { name: 'Lumber', value: 22, color: '#F59E0B' },
  { name: 'Electrical', value: 10, color: '#EF4444' },
  { name: 'Plumbing', value: 5, color: '#8B5CF6' }
]

const regionalData: ChartData[] = [
  { name: 'North America', value: 45, growth: 12 },
  { name: 'Europe', value: 28, growth: 8 },
  { name: 'Asia Pacific', value: 18, growth: 25 },
  { name: 'Latin America', value: 6, growth: 15 },
  { name: 'Middle East', value: 3, growth: 5 }
]

const aiInsightsData: ChartData[] = [
  { name: 'Price Optimization', impact: 15, accuracy: 92 },
  { name: 'Demand Forecasting', impact: 22, accuracy: 88 },
  { name: 'Route Optimization', impact: 18, accuracy: 94 },
  { name: 'Inventory Management', impact: 12, accuracy: 89 },
  { name: 'Customer Matching', impact: 8, accuracy: 91 }
]

const sustainabilityData: ChartData[] = [
  { name: 'Carbon Footprint Reduction', current: 25, target: 40, unit: 'tons CO2' },
  { name: 'Waste Reduction', current: 18, target: 30, unit: 'kg' },
  { name: 'Energy Efficiency', current: 32, target: 50, unit: '%' },
  { name: 'Recycled Materials', current: 15, target: 25, unit: '%' }
]

export default function AnalyticsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('12M')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const metrics: { [key: string]: MetricData } = {
    totalRevenue: {
      value: 890000,
      change: 12.5,
      trend: 'up',
      label: 'Total Revenue'
    },
    activeUsers: {
      value: 1450,
      change: 8.2,
      trend: 'up',
      label: 'Active Users'
    },
    totalOrders: {
      value: 245,
      change: -2.1,
      trend: 'down',
      label: 'Total Orders'
    },
    conversionRate: {
      value: 16.8,
      change: 5.3,
      trend: 'up',
      label: 'Conversion Rate'
    },
    averageOrderValue: {
      value: 363,
      change: 4.7,
      trend: 'up',
      label: 'Avg Order Value'
    },
    customerSatisfaction: {
      value: 4.7,
      change: 2.1,
      trend: 'up',
      label: 'Customer Satisfaction'
    }
  }

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const MetricCard = ({ title, value, change, trend, icon: Icon, description }: any) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-1 text-xs">
          {trend === 'up' ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(change)}%
          </span>
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Award className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedTimeRange === '7D' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('7D')}
            >
              7 Days
            </Button>
            <Button
              variant={selectedTimeRange === '30D' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('30D')}
            >
              30 Days
            </Button>
            <Button
              variant={selectedTimeRange === '3M' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('3M')}
            >
              3 Months
            </Button>
            <Button
              variant={selectedTimeRange === '12M' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('12M')}
            >
              12 Months
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${(metrics.totalRevenue.value / 1000).toFixed(0)}K`}
            change={metrics.totalRevenue.change}
            trend={metrics.totalRevenue.trend}
            icon={DollarSign}
            description="vs last period"
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers.value.toLocaleString()}
            change={metrics.activeUsers.change}
            trend={metrics.activeUsers.trend}
            icon={Users}
            description="monthly active"
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders.value.toLocaleString()}
            change={metrics.totalOrders.change}
            trend={metrics.totalOrders.trend}
            icon={ShoppingCart}
            description="this month"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate.value}%`}
            change={metrics.conversionRate.change}
            trend={metrics.conversionRate.trend}
            icon={Target}
            description="vs target"
          />
          <MetricCard
            title="Avg Order Value"
            value={`$${metrics.averageOrderValue.value}`}
            change={metrics.averageOrderValue.change}
            trend={metrics.averageOrderValue.trend}
            icon={BarChart3}
            description="per order"
          />
          <MetricCard
            title="Customer Rating"
            value={`${metrics.customerSatisfaction.value}/5`}
            change={metrics.customerSatisfaction.change}
            trend={metrics.customerSatisfaction.trend}
            icon={Award}
            description="satisfaction score"
          />
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Platform Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>User engagement and order volume trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Performance</CardTitle>
                  <CardDescription>Orders vs revenue correlation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Growth Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                  <CardDescription>Year-over-year growth rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'Revenue Growth', value: 23.5, target: 20 },
                      { metric: 'User Growth', value: 18.2, target: 15 },
                      { metric: 'Order Growth', value: 15.8, target: 18 },
                      { metric: 'Market Share', value: 12.3, target: 15 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.metric}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.value >= item.target ? 'bg-green-600' : 'bg-yellow-600'
                              }`}
                              style={{ width: `${Math.min((item.value / item.target) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${
                            item.value >= item.target ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {item.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Performance Impact */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Performance Impact</CardTitle>
                  <CardDescription>Impact of AI optimizations on key metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={aiInsightsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="impact" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AI Accuracy */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Accuracy</CardTitle>
                  <CardDescription>Accuracy of AI predictions and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsightsData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${item.accuracy}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-purple-600">
                            {item.accuracy}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sustainability Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Sustainability Metrics</CardTitle>
                  <CardDescription>Environmental impact and sustainability goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {sustainabilityData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm text-gray-600">{item.unit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              item.current >= (item.target * 0.8) ? 'bg-green-600' : 
                              item.current >= (item.target * 0.6) ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${(item.current / item.target) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Current: {item.current}</span>
                          <span>Target: {item.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Green Initiative Impact */}
              <Card>
                <CardHeader>
                  <CardTitle>Green Initiative Impact</CardTitle>
                  <CardDescription>Environmental benefits from platform usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'Trees Planted Equivalent', value: 1250, unit: 'trees' },
                      { metric: 'Carbon Offset', value: 85, unit: 'tons CO2' },
                      { metric: 'Waste Diverted', value: 320, unit: 'kg' },
                      { metric: 'Energy Saved', value: 1800, unit: 'kWh' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.metric}</p>
                          <p className="text-sm text-gray-600">This month</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{item.value}</p>
                          <p className="text-sm text-gray-600">{item.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                  <CardDescription>Market share by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={regionalData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Regional Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>Regional Growth Rates</CardTitle>
                  <CardDescription>Year-over-year growth by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionalData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                          <span className="font-medium">{region.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {region.value}% Share
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            +{region.growth}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      </div>
    </div>
  )
}