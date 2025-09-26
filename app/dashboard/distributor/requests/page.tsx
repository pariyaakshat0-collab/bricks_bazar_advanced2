"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Clock, CheckCircle, MapPin, Package, User, Calendar } from "lucide-react"

export default function RequestsPage() {
  const [requests] = useState([
    {
      id: "REQ-001",
      type: "Supply Request",
      from: "ABC Construction Co.",
      fromType: "buyer",
      product: "Premium Red Bricks",
      quantity: "5000 units",
      location: "Downtown District",
      urgency: "High",
      status: "pending",
      requestDate: "2024-01-15",
      deadline: "2024-01-20",
      estimatedValue: "$2,250",
    },
    {
      id: "REQ-002",
      type: "Bulk Order",
      from: "BuildMart Retailers",
      fromType: "seller",
      product: "Portland Cement",
      quantity: "200 bags",
      location: "Industrial Zone",
      urgency: "Medium",
      status: "accepted",
      requestDate: "2024-01-14",
      deadline: "2024-01-25",
      estimatedValue: "$2,500",
    },
    {
      id: "REQ-003",
      type: "Emergency Supply",
      from: "QuickBuild Ltd.",
      fromType: "buyer",
      product: "Steel Rebar",
      quantity: "50 tons",
      location: "North Side",
      urgency: "Critical",
      status: "in-progress",
      requestDate: "2024-01-13",
      deadline: "2024-01-16",
      estimatedValue: "$12,500",
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Accepted
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>
      case "High":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            High
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Medium
          </Badge>
        )
      case "Low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="secondary">{urgency}</Badge>
    }
  }

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const activeRequests = requests.filter((req) => req.status === "accepted" || req.status === "in-progress")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Supply Requests</h1>
        <p className="text-muted-foreground">Manage incoming supply requests from buyers and sellers</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeRequests.length}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$17,250</div>
            <p className="text-xs text-muted-foreground">Estimated value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Supply Requests</CardTitle>
              <CardDescription>Complete list of supply requests from buyers and sellers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{request.from}</div>
                            <div className="text-xs text-muted-foreground capitalize">{request.fromType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.product}</div>
                          <div className="text-xs text-muted-foreground">{request.quantity}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {request.location}
                        </div>
                      </TableCell>
                      <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="font-medium">{request.estimatedValue}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {request.status === "pending" && (
                            <>
                              <Button size="sm" variant="default">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                            </>
                          )}
                          {request.status === "accepted" && (
                            <Button size="sm" variant="default">
                              Start Delivery
                            </Button>
                          )}
                          {request.status === "in-progress" && (
                            <Button size="sm" variant="default">
                              Update Status
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Pending Requests
              </CardTitle>
              <CardDescription>Requests awaiting your response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{request.id}</Badge>
                            {getUrgencyBadge(request.urgency)}
                          </div>
                          <h3 className="font-semibold">{request.product}</h3>
                          <p className="text-sm text-muted-foreground">
                            Requested by {request.from} • {request.quantity}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {request.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {request.deadline}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{request.estimatedValue}</div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm">Accept</Button>
                            <Button size="sm" variant="outline">
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
