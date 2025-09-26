"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, CheckCircle, Clock, Search, Eye, Download, MessageCircle } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  date: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  total: number
  items: number
  supplier: string
  estimatedDelivery: string
  trackingNumber?: string
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 45000,
      items: 3,
      supplier: "Delhi Brick Works",
      estimatedDelivery: "2024-01-20",
      trackingNumber: "TRK123456789",
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      date: "2024-01-18",
      status: "shipped",
      total: 28500,
      items: 2,
      supplier: "UltraTech",
      estimatedDelivery: "2024-01-22",
      trackingNumber: "TRK987654321",
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      date: "2024-01-20",
      status: "confirmed",
      total: 67200,
      items: 5,
      supplier: "Local Sand Supplier",
      estimatedDelivery: "2024-01-25",
    },
    {
      id: "4",
      orderNumber: "ORD-2024-004",
      date: "2024-01-22",
      status: "pending",
      total: 15800,
      items: 1,
      supplier: "Steel Works Ltd",
      estimatedDelivery: "2024-01-28",
    },
  ])

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeOrders = filteredOrders.filter((order) => ["pending", "confirmed", "shipped"].includes(order.status))

  const completedOrders = filteredOrders.filter((order) => ["delivered", "cancelled"].includes(order.status))

  const OrderCard = ({ order }: { order: Order }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">Ordered on {new Date(order.date).toLocaleDateString()}</p>
            <p className="text-sm text-muted-foreground">from {order.supplier}</p>
          </div>
          <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
            {getStatusIcon(order.status)}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-semibold">₹{order.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="font-semibold">{order.items} items</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expected Delivery</p>
            <p className="font-semibold">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tracking</p>
            <p className="font-semibold text-xs">{order.trackingNumber || "Not assigned"}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {order.trackingNumber && (
            <Button variant="outline" size="sm">
              <Truck className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Supplier
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your construction material orders</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search orders or suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Order Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Order History ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active orders</h3>
                <p className="text-muted-foreground text-center mb-4">You don't have any active orders at the moment</p>
                <Button>Browse Products</Button>
              </CardContent>
            </Card>
          ) : (
            activeOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No completed orders</h3>
                <p className="text-muted-foreground text-center">Your completed orders will appear here</p>
              </CardContent>
            </Card>
          ) : (
            completedOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
