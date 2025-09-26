"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Navigation,
  Phone,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Plus
} from "lucide-react"
import { EnhancedDashboardHeader } from "@/components/shared/enhanced-dashboard-header"

interface Shipment {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  pickupAddress: string
  status: "pending" | "picked-up" | "in-transit" | "delivered" | "delayed"
  priority: "low" | "medium" | "high" | "urgent"
  estimatedDelivery: string
  actualDelivery?: string
  driverName: string
  driverPhone: string
  vehicleNumber: string
  currentLocation: string
  distanceRemaining: number
  totalDistance: number
  packages: number
  weight: number
  value: number
  trackingUpdates: {
    timestamp: string
    status: string
    location: string
    notes?: string
  }[]
}

export default function DistributorTrackingPage() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  useEffect(() => {
    // Simulate loading shipment data
    setTimeout(() => {
      setShipments([
        {
          id: "SH001",
          orderId: "ORD-2024-001",
          customerName: "Amit Construction Co.",
          customerPhone: "+91 98765 43210",
          deliveryAddress: "Sector 15, Noida, Uttar Pradesh",
          pickupAddress: "Delhi Warehouse, Delhi",
          status: "in-transit",
          priority: "high",
          estimatedDelivery: "2024-01-16T14:00:00Z",
          driverName: "Ramesh Kumar",
          driverPhone: "+91 91234 56789",
          vehicleNumber: "DL01AB1234",
          currentLocation: "Ghaziabad, Uttar Pradesh",
          distanceRemaining: 25,
          totalDistance: 45,
          packages: 50,
          weight: 2500,
          value: 125000,
          trackingUpdates: [
            {
              timestamp: "2024-01-16T08:00:00Z",
              status: "Picked up",
              location: "Delhi Warehouse, Delhi",
              notes: "Goods loaded and verified"
            },
            {
              timestamp: "2024-01-16T10:30:00Z",
              status: "In transit",
              location: "Ghaziabad, Uttar Pradesh",
              notes: "Crossed Delhi border"
            }
          ]
        },
        {
          id: "SH002",
          orderId: "ORD-2024-002",
          customerName: "Sharma Builders",
          customerPhone: "+91 99887 76655",
          deliveryAddress: "Gurugram, Haryana",
          pickupAddress: "Mumbai Warehouse, Mumbai",
          status: "delivered",
          priority: "medium",
          estimatedDelivery: "2024-01-15T18:00:00Z",
          actualDelivery: "2024-01-15T16:30:00Z",
          driverName: "Suresh Singh",
          driverPhone: "+91 92345 67890",
          vehicleNumber: "MH02CD5678",
          currentLocation: "Gurugram, Haryana",
          distanceRemaining: 0,
          totalDistance: 1400,
          packages: 25,
          weight: 1200,
          value: 85000,
          trackingUpdates: [
            {
              timestamp: "2024-01-14T06:00:00Z",
              status: "Picked up",
              location: "Mumbai Warehouse, Mumbai",
              notes: "Goods loaded and verified"
            },
            {
              timestamp: "2024-01-15T16:30:00Z",
              status: "Delivered",
              location: "Gurugram, Haryana",
              notes: "Delivery completed successfully"
            }
          ]
        },
        {
          id: "SH003",
          orderId: "ORD-2024-003",
          customerName: "Verma Construction",
          customerPhone: "+91 97654 32109",
          deliveryAddress: "Faridabad, Haryana",
          pickupAddress: "Chennai Warehouse, Chennai",
          status: "pending",
          priority: "urgent",
          estimatedDelivery: "2024-01-17T12:00:00Z",
          driverName: "Rajesh Patel",
          driverPhone: "+91 93456 78901",
          vehicleNumber: "TN03EF9012",
          currentLocation: "Chennai Warehouse, Chennai",
          distanceRemaining: 2200,
          totalDistance: 2200,
          packages: 75,
          weight: 3500,
          value: 200000,
          trackingUpdates: [
            {
              timestamp: "2024-01-16T12:00:00Z",
              status: "Order confirmed",
              location: "Chennai Warehouse, Chennai",
              notes: "Awaiting pickup"
            }
          ]
        },
        {
          id: "SH004",
          orderId: "ORD-2024-004",
          customerName: "Gupta & Sons Construction",
          customerPhone: "+91 96543 21098",
          deliveryAddress: "Noida, Uttar Pradesh",
          pickupAddress: "Kolkata Warehouse, Kolkata",
          status: "picked-up",
          priority: "low",
          estimatedDelivery: "2024-01-18T10:00:00Z",
          driverName: "Manoj Sharma",
          driverPhone: "+91 94567 89012",
          vehicleNumber: "WB04GH3456",
          currentLocation: "Kolkata, West Bengal",
          distanceRemaining: 1500,
          totalDistance: 1500,
          packages: 30,
          weight: 1800,
          value: 95000,
          trackingUpdates: [
            {
              timestamp: "2024-01-16T14:00:00Z",
              status: "Picked up",
              location: "Kolkata Warehouse, Kolkata",
              notes: "Goods loaded and verified"
            }
          ]
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const statuses = ["all", "pending", "picked-up", "in-transit", "delivered", "delayed"]
  const priorities = ["all", "low", "medium", "high", "urgent"]

  const filteredShipments = shipments.filter(shipment => {
    const statusMatch = selectedStatus === "all" || shipment.status === selectedStatus
    const priorityMatch = selectedPriority === "all" || shipment.priority === selectedPriority
    return statusMatch && priorityMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "picked-up":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "in-transit":
        return <Truck className="h-4 w-4" />
      case "picked-up":
        return <Package className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getProgressPercentage = (shipment: Shipment) => {
    if (shipment.status === "delivered") return 100
    if (shipment.status === "pending") return 0
    if (shipment.status === "picked-up") return 25
    if (shipment.status === "in-transit") return 75
    if (shipment.status === "delayed") return 50
    return 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedDashboardHeader title="Shipment Tracking" subtitle="Monitor your deliveries in real-time" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shipment Tracking</h1>
              <p className="text-gray-600">Real-time tracking and management of deliveries</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Shipment
              </Button>
            </div>
          </div>

          {/* Alert Cards */}
          {filteredShipments.filter(s => s.status === "delayed").length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Delayed Shipments</AlertTitle>
              <AlertDescription>
                {filteredShipments.filter(s => s.status === "delayed").length} shipments are delayed and need attention.
              </AlertDescription>
            </Alert>
          )}

          {filteredShipments.filter(s => s.priority === "urgent").length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Urgent Priority</AlertTitle>
              <AlertDescription>
                {filteredShipments.filter(s => s.priority === "urgent").length} urgent shipments require immediate attention.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shipments.length}</div>
                <p className="text-xs text-muted-foreground">Active deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{shipments.filter(s => s.status === "in-transit").length}</div>
                <p className="text-xs text-muted-foreground">On the road</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{shipments.filter(s => s.status === "delivered").length}</div>
                <p className="text-xs text-muted-foreground">Completed today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{shipments.filter(s => s.status === "pending").length}</div>
                <p className="text-xs text-muted-foreground">Awaiting pickup</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delayed</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{shipments.filter(s => s.status === "delayed").length}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>
                Track and manage all your deliveries in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority === "all" ? "All Priority" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1"></div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>

              {/* Shipments Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          Loading shipment data...
                        </TableCell>
                      </TableRow>
                    ) : filteredShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          No shipments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell>
                            <div className="font-medium">{shipment.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{shipment.orderId}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{shipment.customerName}</div>
                              <div className="text-sm text-gray-500">{shipment.customerPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(shipment.status)}>
                              {getStatusIcon(shipment.status)}
                              <span className="ml-1">{shipment.status.replace("-", " ").toUpperCase()}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(shipment.priority)}>
                              {shipment.priority.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Progress value={getProgressPercentage(shipment)} className="h-2" />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{shipment.totalDistance - shipment.distanceRemaining} km</span>
                                <span>{shipment.totalDistance} km</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{shipment.driverName}</div>
                              <div className="text-sm text-gray-500">{shipment.driverPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{shipment.vehicleNumber}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-500">{new Date(shipment.estimatedDelivery).toLocaleTimeString()}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Contact Driver">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Track Location">
                                <Navigation className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
