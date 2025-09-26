"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Eye, Ban, CheckCircle, AlertTriangle, Flag } from "lucide-react"

const products = [
  {
    id: "PRD-001",
    name: "Premium Red Bricks",
    seller: "Local Brick Co.",
    category: "Bricks",
    price: 8.5,
    unit: "per piece",
    status: "active",
    reports: 0,
    rating: 4.9,
    reviews: 124,
    stock: 25000,
    dateAdded: "2024-01-10",
  },
  {
    id: "PRD-002",
    name: "OPC Cement 50kg",
    seller: "BuildMart",
    category: "Cement",
    price: 420,
    unit: "per bag",
    status: "active",
    reports: 0,
    rating: 4.6,
    reviews: 89,
    stock: 500,
    dateAdded: "2024-01-12",
  },
  {
    id: "PRD-003",
    name: "Low Quality Cement",
    seller: "QuickBuild Materials",
    category: "Cement",
    price: 350,
    unit: "per bag",
    status: "reported",
    reports: 5,
    rating: 2.1,
    reviews: 23,
    stock: 100,
    dateAdded: "2024-01-20",
  },
  {
    id: "PRD-004",
    name: "TMT Steel Rods 12mm",
    seller: "Steel Works Ltd.",
    category: "Steel",
    price: 65,
    unit: "per kg",
    status: "pending",
    reports: 0,
    rating: 0,
    reviews: 0,
    stock: 2000,
    dateAdded: "2024-01-23",
  },
  {
    id: "PRD-005",
    name: "River Sand",
    seller: "Sand Suppliers Co.",
    category: "Sand",
    price: 1200,
    unit: "per ton",
    status: "suspended",
    reports: 2,
    rating: 3.8,
    reviews: 45,
    stock: 0,
    dateAdded: "2024-01-18",
  },
]

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const categories = ["all", "Bricks", "Cement", "Steel", "Sand", "Blocks"]
  const statuses = ["all", "active", "pending", "reported", "suspended"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "reported":
        return "destructive"
      case "suspended":
        return "outline"
      default:
        return "outline"
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Product Management</h1>
        <p className="text-muted-foreground">Monitor and manage all products on the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
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
                <p className="text-2xl font-bold">{products.filter((p) => p.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Reported</p>
                <p className="text-2xl font-bold">{products.filter((p) => p.status === "reported").length}</p>
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
                <p className="text-2xl font-bold">{products.filter((p) => p.status === "pending").length}</p>
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
            placeholder="Search products, sellers, or IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
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

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            Showing {filteredProducts.length} of {products.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        {product.reports > 0 && (
                          <Badge variant="destructive" className="gap-1">
                            <Flag className="h-3 w-3" />
                            {product.reports} reports
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">by {product.seller}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{product.category}</Badge>
                        <Badge variant={getStatusColor(product.status)}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">ID: {product.id}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{product.price}</p>
                      <p className="text-sm text-muted-foreground">{product.unit}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Stock</p>
                      <p className="font-medium">{product.stock.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium">{product.rating > 0 ? `${product.rating} ⭐` : "No ratings"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reviews</p>
                      <p className="font-medium">{product.reviews}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date Added</p>
                      <p className="font-medium">{new Date(product.dateAdded).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  {product.status === "pending" && (
                    <Button size="sm" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {product.status === "reported" && (
                    <Button size="sm" variant="destructive" className="gap-2">
                      <Flag className="h-4 w-4" />
                      Review Reports
                    </Button>
                  )}
                  {product.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive bg-transparent"
                    >
                      <Ban className="h-4 w-4" />
                      Suspend
                    </Button>
                  )}
                  {product.status === "suspended" && (
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
