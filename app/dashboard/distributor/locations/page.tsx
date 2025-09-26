"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Plus, Edit, Trash2, Clock, CheckCircle } from "lucide-react"

export default function LocationManagementPage() {
  const [locations] = useState([
    {
      id: "1",
      name: "Downtown District",
      address: "123 Main Street, Downtown",
      radius: "15 km",
      status: "active",
      deliveryTime: "2-4 hours",
      activeOrders: 12,
      totalDeliveries: 245,
    },
    {
      id: "2",
      name: "Industrial Zone",
      address: "456 Industrial Ave, Zone B",
      radius: "25 km",
      status: "active",
      deliveryTime: "4-6 hours",
      activeOrders: 8,
      totalDeliveries: 189,
    },
    {
      id: "3",
      name: "North Side",
      address: "789 North Road, Sector 5",
      radius: "20 km",
      status: "maintenance",
      deliveryTime: "6-8 hours",
      activeOrders: 3,
      totalDeliveries: 156,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    radius: "",
    deliveryTime: "",
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Maintenance
          </Badge>
        )
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle adding new location
    console.log("New location:", newLocation)
    setShowAddForm(false)
    setNewLocation({ name: "", address: "", radius: "", deliveryTime: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location Management</h1>
          <p className="text-muted-foreground">Manage your delivery areas and service zones</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">Service areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Areas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {locations.filter((l) => l.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently serving</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {locations.reduce((sum, l) => sum + l.activeOrders, 0)}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.reduce((sum, l) => sum + l.totalDeliveries, 0)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Location Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Service Location</CardTitle>
            <CardDescription>Define a new area where you can provide delivery services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Downtown District"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius">Service Radius</Label>
                  <Input
                    id="radius"
                    placeholder="e.g., 15 km"
                    value={newLocation.radius}
                    onChange={(e) => setNewLocation((prev) => ({ ...prev, radius: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Full address of the service area"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryTime">Estimated Delivery Time</Label>
                <Input
                  id="deliveryTime"
                  placeholder="e.g., 2-4 hours"
                  value={newLocation.deliveryTime}
                  onChange={(e) => setNewLocation((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Location</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Locations</CardTitle>
          <CardDescription>Manage your delivery areas and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Service Radius</TableHead>
                <TableHead>Delivery Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active Orders</TableHead>
                <TableHead>Total Deliveries</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.radius}</TableCell>
                  <TableCell>{location.deliveryTime}</TableCell>
                  <TableCell>{getStatusBadge(location.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{location.activeOrders}</Badge>
                  </TableCell>
                  <TableCell>{location.totalDeliveries}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
