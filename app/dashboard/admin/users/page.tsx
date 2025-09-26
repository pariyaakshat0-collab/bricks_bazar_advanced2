"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, Shield, Ban, CheckCircle, AlertTriangle, Eye, Mail } from "lucide-react"

const users = [
  {
    id: "USR-001",
    name: "Rajesh Kumar",
    email: "rajesh@construction.com",
    role: "buyer",
    status: "active",
    verified: true,
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    orders: 25,
    totalSpent: 125000,
    rating: 4.8,
  },
  {
    id: "USR-002",
    name: "BuildMart Supplies",
    email: "info@buildmart.com",
    role: "seller",
    status: "active",
    verified: true,
    joinDate: "2023-12-10",
    lastActive: "1 hour ago",
    orders: 156,
    totalSpent: 0,
    rating: 4.6,
  },
  {
    id: "USR-003",
    name: "Fast Logistics",
    email: "dispatch@fastlogistics.in",
    role: "distributor",
    status: "active",
    verified: true,
    joinDate: "2024-01-08",
    lastActive: "30 minutes ago",
    orders: 89,
    totalSpent: 0,
    rating: 4.9,
  },
  {
    id: "USR-004",
    name: "QuickBuild Materials",
    email: "sales@quickbuild.com",
    role: "seller",
    status: "suspended",
    verified: false,
    joinDate: "2024-01-20",
    lastActive: "1 day ago",
    orders: 12,
    totalSpent: 0,
    rating: 3.2,
  },
  {
    id: "USR-005",
    name: "Home Builders Ltd",
    email: "procurement@homebuilders.in",
    role: "buyer",
    status: "pending",
    verified: false,
    joinDate: "2024-01-22",
    lastActive: "5 hours ago",
    orders: 3,
    totalSpent: 45000,
    rating: 4.5,
  },
]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const roles = ["all", "buyer", "seller", "distributor"]
  const statuses = ["all", "active", "pending", "suspended"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "buyer":
        return "default"
      case "seller":
        return "secondary"
      case "distributor":
        return "outline"
      default:
        return "outline"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage all users across the BricksBazar platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.verified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.verified && <Shield className="h-4 w-4 text-green-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getRoleColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                        <Badge variant={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">ID: {user.id}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {user.role === "buyer" ? `₹${user.totalSpent.toLocaleString()}` : `${user.orders} orders`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.role === "buyer" ? "Total spent" : "Completed"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Joined</p>
                      <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Active</p>
                      <p className="font-medium">{user.lastActive}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium">{user.rating} ⭐</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Orders</p>
                      <p className="font-medium">{user.orders}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                  {user.status === "pending" && (
                    <Button size="sm" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {user.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive bg-transparent"
                    >
                      <Ban className="h-4 w-4" />
                      Suspend
                    </Button>
                  )}
                  {user.status === "suspended" && (
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <CheckCircle className="h-4 w-4" />
                      Reactivate
                    </Button>
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
