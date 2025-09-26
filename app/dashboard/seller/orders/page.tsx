"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, Eye, MessageSquare } from "lucide-react"

const orders = [
  {
    id: "ORD-001",
    product: "Premium Red Bricks",
    quantity: "5,000 pieces",
    buyer: "Rajesh Construction",
    buyerEmail: "rajesh@construction.com",
    amount: 42500,
    status: "processing",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-18",
    address: "Site 123, Construction Area, Mumbai",
    paymentStatus: "paid",
  },
  {
    id: "ORD-002",
    product: "OPC Cement 50kg",
    quantity: "25 bags",
    buyer: "BuildTech Ltd.",
    buyerEmail: "orders@buildtech.com",
    amount: 10500,
    status: "confirmed",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-17",
    address: "Warehouse B, Industrial Zone, Pune",
    paymentStatus: "paid",
  },
  {
    id: "ORD-003",
    product: "Concrete Blocks",
    quantity: "200 pieces",
    buyer: "Home Builders",
    buyerEmail: "procurement@homebuilders.in",
    amount: 9000,
    status: "shipped",
    orderDate: "2024-01-13",
    deliveryDate: "2024-01-16",
    address: "Plot 45, Residential Complex, Delhi",
    paymentStatus: "paid",
  },
  {
    id: "ORD-004",
    product: "River Sand",
    quantity: "3 tons",
    buyer: "Quick Build Co.",
    buyerEmail: "materials@quickbuild.com",
    amount: 3600,
    status: "delivered",
    orderDate: "2024-01-12",
    deliveryDate: "2024-01-15",
    address: "Construction Site, Sector 21, Gurgaon",
    paymentStatus: "paid",
  },
  {
    id: "ORD-005",
    product: "TMT Steel Rods 12mm",
    quantity: "500 kg",
    buyer: "Steel Works Project",
    buyerEmail: "orders@steelworks.co.in",
    amount: 32500,
    status: "pending",
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-19",
    address: "Factory Unit 12, Industrial Area, Chennai",
    paymentStatus: "pending",
  },
]

export default function SellerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const statuses = ["all", "pending", "processing", "confirmed", "shipped", "delivered"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "outline"
      case "confirmed":
        return "default"
      case "shipped":
        return "secondary"
      case "delivered":
        return "default"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground">Track and manage all your customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statuses.slice(1).map((status) => {
          const count = orders.filter((order) => order.status === status).length
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">{status}</p>
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
            placeholder="Search orders, products, or buyers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{order.id}</h3>
                    <Badge variant={getStatusColor(order.status)} className="gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                      {order.paymentStatus === "paid" ? "Paid" : "Payment Pending"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Ordered on {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{order.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Product Details</h4>
                  <div className="space-y-1">
                    <p>
                      <span className="text-muted-foreground">Product:</span> {order.product}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Quantity:</span> {order.quantity}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Delivery Date:</span>{" "}
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Buyer Information</h4>
                  <div className="space-y-1">
                    <p>
                      <span className="text-muted-foreground">Company:</span> {order.buyer}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {order.buyerEmail}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Address:</span> {order.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Contact Buyer
                </Button>
                {order.status === "pending" && <Button size="sm">Accept Order</Button>}
                {order.status === "processing" && <Button size="sm">Mark as Confirmed</Button>}
                {order.status === "confirmed" && <Button size="sm">Mark as Shipped</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Orders
        </Button>
      </div>
    </div>
  )
}
