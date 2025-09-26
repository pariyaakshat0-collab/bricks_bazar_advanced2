"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Package, ShoppingCart, Star } from "lucide-react"

export default function SellerAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Sales Analytics</h1>
        <p className="text-muted-foreground">Track your business performance and growth</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹9,88,400</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+8.2%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹6,816</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+3.8%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+0.2</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Revenue chart would go here</p>
                <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>Number of orders per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Order volume chart would go here</p>
                <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best sellers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Premium Red Bricks", revenue: 382500, orders: 45, growth: "+15%" },
                { name: "River Sand", revenue: 264000, orders: 22, growth: "+22%" },
                { name: "OPC Cement 50kg", revenue: 134400, orders: 32, growth: "+8%" },
                { name: "TMT Steel Rods 12mm", revenue: 126000, orders: 28, growth: "+12%" },
                { name: "Concrete Blocks", revenue: 81000, orders: 18, growth: "+5%" },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{product.revenue.toLocaleString()}</p>
                    <Badge variant="outline" className="text-green-600">
                      {product.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Understanding your buyer base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Top Customers</h4>
                <div className="space-y-2">
                  {[
                    { name: "Rajesh Construction", orders: 12, spent: 125000 },
                    { name: "BuildTech Ltd.", orders: 8, spent: 89000 },
                    { name: "Home Builders", orders: 6, spent: 67000 },
                  ].map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                      </div>
                      <p className="font-bold">₹{customer.spent.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Customer Satisfaction</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>5 Star Reviews</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>4+ Star Reviews: 89%</span>
                    <span>156 total reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Analytics</CardTitle>
          <CardDescription>Track your payment performance and outstanding amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold text-green-600">Payments Received</h4>
              <p className="text-2xl font-bold mt-2">₹8,45,200</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold text-orange-600">Pending Payments</h4>
              <p className="text-2xl font-bold mt-2">₹1,43,200</p>
              <p className="text-sm text-muted-foreground">Outstanding</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-600">Average Payment Time</h4>
              <p className="text-2xl font-bold mt-2">3.2 days</p>
              <p className="text-sm text-muted-foreground">From order to payment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
