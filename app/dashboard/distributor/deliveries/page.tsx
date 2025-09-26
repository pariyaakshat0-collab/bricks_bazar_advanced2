"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Package, Phone, MessageSquare, Navigation } from "lucide-react"

const deliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-001",
    product: "Premium Red Bricks",
    quantity: "5,000 pieces",
    pickup: {
      name: "Local Brick Co.",
      address: "Industrial Area, Sector 15, Mumbai",
      contact: "+91 98765 43210",
      time: "10:00 AM",
    },
    delivery: {
      name: "Rajesh Construction Site",
      address: "Plot 123, Construction Zone, Mumbai",
      contact: "+91 87654 32109",
      time: "2:30 PM",
    },
    status: "in_transit",
    distance: "12.5 km",
    payment: 2500,
    priority: "high",
    progress: 65,
    estimatedTime: "45 mins",
  },
  {
    id: "DEL-002",
    orderId: "ORD-002",
    product: "OPC Cement 50kg",
    quantity: "25 bags",
    pickup: {
      name: "BuildMart Warehouse",
      address: "Warehouse Complex, Pune",
      contact: "+91 76543 21098",
      time: "11:30 AM",
    },
    delivery: {
      name: "BuildTech Ltd.",
      address: "Office Complex, Pune",
      contact: "+91 65432 10987",
      time: "3:45 PM",
    },
    status: "loading",
    distance: "8.2 km",
    payment: 1800,
    priority: "medium",
    progress: 15,
    estimatedTime: "2 hours",
  },
  {
    id: "DEL-003",
    orderId: "ORD-003",
    product: "Concrete Blocks",
    quantity: "200 pieces",
    pickup: {
      name: "Block Masters",
      address: "Manufacturing Unit, Delhi",
      contact: "+91 54321 09876",
      time: "1:00 PM",
    },
    delivery: {
      name: "Home Builders Site",
      address: "Residential Project, Delhi",
      contact: "+91 43210 98765",
      time: "4:15 PM",
    },
    status: "pickup_ready",
    distance: "15.8 km",
    payment: 3200,
    priority: "low",
    progress: 0,
    estimatedTime: "3 hours",
  },
  {
    id: "DEL-004",
    orderId: "ORD-004",
    product: "River Sand",
    quantity: "3 tons",
    pickup: {
      name: "Sand Suppliers Co.",
      address: "Quarry Site, Gurgaon",
      contact: "+91 32109 87654",
      time: "9:00 AM",
    },
    delivery: {
      name: "Quick Build Co.",
      address: "Construction Site, Gurgaon",
      contact: "+91 21098 76543",
      time: "12:30 PM",
    },
    status: "delivered",
    distance: "22.1 km",
    payment: 2200,
    priority: "medium",
    progress: 100,
    estimatedTime: "Completed",
  },
]

export default function DeliveriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  const statuses = ["all", "pickup_ready", "loading", "in_transit", "delivered"]
  const priorities = ["all", "high", "medium", "low"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pickup_ready":
        return "outline"
      case "loading":
        return "secondary"
      case "in_transit":
        return "default"
      case "delivered":
        return "default"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.pickup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.delivery.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || delivery.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || delivery.priority === selectedPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Delivery Management</h1>
        <p className="text-muted-foreground">Track and manage all your delivery operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statuses.slice(1).map((status) => {
          const count = deliveries.filter((delivery) => delivery.status === status).length
          const statusLabels = {
            pickup_ready: "Ready for Pickup",
            loading: "Loading",
            in_transit: "In Transit",
            delivered: "Delivered",
          }
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
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
            placeholder="Search deliveries, products, or locations..."
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pickup_ready">Ready for Pickup</SelectItem>
            <SelectItem value="loading">Loading</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{delivery.id}</h3>
                    <Badge variant={getStatusColor(delivery.status)}>
                      {delivery.status === "pickup_ready"
                        ? "Ready for Pickup"
                        : delivery.status === "in_transit"
                          ? "In Transit"
                          : delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                    </Badge>
                    <Badge variant={getPriorityColor(delivery.priority)}>
                      {delivery.priority.charAt(0).toUpperCase() + delivery.priority.slice(1)} Priority
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Order: {delivery.orderId} • {delivery.product} ({delivery.quantity})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{delivery.payment.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {delivery.distance} • {delivery.estimatedTime}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Pickup Location
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{delivery.pickup.name}</p>
                    <p className="text-muted-foreground">{delivery.pickup.address}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {delivery.pickup.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {delivery.pickup.contact}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Location
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{delivery.delivery.name}</p>
                    <p className="text-muted-foreground">{delivery.delivery.address}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {delivery.delivery.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {delivery.delivery.contact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {delivery.status !== "delivered" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Delivery Progress</span>
                    <span>{delivery.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${delivery.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Navigation className="h-4 w-4" />
                  Navigate
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Phone className="h-4 w-4" />
                  Call Pickup
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Message Customer
                </Button>
                {delivery.status === "pickup_ready" && <Button size="sm">Start Pickup</Button>}
                {delivery.status === "loading" && <Button size="sm">Mark as In Transit</Button>}
                {delivery.status === "in_transit" && <Button size="sm">Mark as Delivered</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Deliveries
        </Button>
      </div>
    </div>
  )
}
