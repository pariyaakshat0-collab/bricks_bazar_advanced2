"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, AlertTriangle, CheckCircle, Clock, Truck } from "lucide-react"

const orders = [
  {
    id: "ORD-001",
    buyer: "Rajesh Construction",
    seller: "Local Brick Co.",
    product: "Premium Red Bricks",
    quantity: "5,000 pieces",
    amount: 42500,
    status: "delivered",
    paymentStatus: "completed",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-18",
    disputes: 0,
  },
  {
    id: "ORD-002",
    buyer: "BuildTech Ltd.",
    seller: "BuildMart",
    product: "OPC Cement 50kg",
    quantity: "25 bags",
    amount: 10500,
    status: "in_transit",
    paymentStatus: "completed",
    orderDate: "2024-01-20",
    deliveryDate: "2024-01-23",
    disputes: 0,
  },
  {
    id: "ORD-003",
    buyer: "Home Builders",
    seller: "QuickBuild Materials",
    product: "Low Quality Cement",
    quantity: "50 bags",
    amount: 17500,
    status: "disputed",
    paymentStatus: "held",
    orderDate: "2024-01-18",
    deliveryDate: "2024-01-21",
    disputes: 1,
  },
  {
    id: "ORD-004",
    buyer: "Quick Build Co.",
    seller: "Sand Suppliers Co.",
    product: "River Sand",
    quantity: "3 tons",
    amount: 3600,
    status: "cancelled",
    paymentStatus: "refunded",
    orderDate: "2024-01-19",
    deliveryDate: null,
    disputes: 0,
  },
  {
    id: "ORD-005",
    buyer: "Steel Works Project",
    seller: "Steel Works Ltd.",
    product: "TMT Steel Rods 12mm",
    quantity: "500 kg",
    amount: 32500,
    status: "processing",
    paymentStatus: "completed",
    orderDate: "2024-01-22",
    deliveryDate: "2024-01-25",
    disputes: 0,
  },
]

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")

  const statuses = ["all", "processing", "in_transit", "delivered", "disputed", "cancelled"]
  const paymentStatuses = ["all", "completed", "pending", "held", "refunded"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "in_transit":
        return "secondary"
      case "processing":
        return "outline"
      case "disputed":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "held":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "disputed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <ShoppingCart className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "all" || order.paymentStatus === selectedPaymentStatus
    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground">Monitor and manage all orders across the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statuses.slice(1).map((status) => {
          const count = orders.filter((order) => order.status === status).length
          const statusLabels = {
            processing: "Processing",
            in_transit: "In Transit",
            delivered: "Delivered",
            disputed: "Disputed",
            cancelled: "Cancelled",
          }
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <div>
                    <p className="text-sm text-muted-foreground">{statusLabels[status as keyof typeof statusLabels]}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders, buyers, sellers, or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            {paymentStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Payments" : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} of {orders.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{order.id}</h3>
                      <Badge variant={getStatusColor(order.status)} className="gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("_", " ")}
                      </Badge>
                      <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                      {order.disputes > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {order.disputes} dispute{order.disputes > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      Ordered on {new Date(order.orderDate).toLocaleDateString()}
                      {order.deliveryDate && ` • Delivery: ${new Date(order.deliveryDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{order.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold mb-1">Product Details</h4>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Product:</span> {order.product}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Quantity:</span> {order.quantity}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Buyer</h4>
                    <p className="text-sm font-medium">{order.buyer}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Seller</h4>
                    <p className="text-sm font-medium">{order.seller}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                    View Details
                  </button>
                  {order.status === "disputed" && (
                    <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600">
                      Resolve Dispute
                    </button>
                  )}
                  {order.status === "processing" && (
                    <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                      Approve Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
