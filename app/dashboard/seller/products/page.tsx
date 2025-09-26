"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Eye, TrendingUp, Package, DollarSign, AlertCircle, Star, Image as ImageIcon } from "lucide-react"
import { EnhancedDashboardHeader } from "@/components/shared/enhanced-dashboard-header"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  status: "active" | "draft" | "archived"
  image?: string
  sku: string
  createdAt: string
  updatedAt: string
  rating?: number
  reviews?: number
}

const categories = ["Electrical", "Plumbing", "Hardware", "Tools", "Safety", "Paint", "Building Materials", "HVAC"]

export default function SellerProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate loading products
    setTimeout(() => {
      setProducts([
        {
          id: "1",
          name: "Premium Electrical Wire - 12 AWG",
          description: "High-quality copper electrical wire suitable for residential and commercial applications. UL listed and meets all safety standards.",
          price: 89.99,
          category: "Electrical",
          stock: 150,
          status: "active",
          sku: "ELEC-12AWG-100",
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
          rating: 4.5,
          reviews: 23
        },
        {
          id: "2",
          name: "Heavy-Duty PVC Pipe - 2 inch",
          description: "Durable PVC pipe perfect for plumbing applications. Pressure rated and suitable for both residential and commercial use.",
          price: 24.99,
          category: "Plumbing",
          stock: 200,
          status: "active",
          sku: "PLMB-PVC-2IN",
          createdAt: "2024-01-10",
          updatedAt: "2024-01-18",
          rating: 4.3,
          reviews: 15
        },
        {
          id: "3",
          name: "Professional Drill Set - 18V",
          description: "Complete cordless drill set with multiple attachments and carrying case. Perfect for professional contractors.",
          price: 199.99,
          category: "Tools",
          stock: 45,
          status: "active",
          sku: "TOOL-DRILL-18V",
          createdAt: "2024-01-12",
          updatedAt: "2024-01-22",
          rating: 4.7,
          reviews: 31
        },
        {
          id: "4",
          name: "Safety Helmet - Yellow",
          description: "OSHA approved safety helmet with adjustable suspension and ventilation ports. Essential for construction sites.",
          price: 34.99,
          category: "Safety",
          stock: 75,
          status: "active",
          sku: "SAFE-HELM-YLW",
          createdAt: "2024-01-08",
          updatedAt: "2024-01-16",
          rating: 4.2,
          reviews: 18
        },
        {
          id: "5",
          name: "Premium Paint - White - 1 Gallon",
          description: "High-quality interior paint with excellent coverage and durability. Low VOC formula for safer indoor use.",
          price: 45.99,
          category: "Paint",
          stock: 0,
          status: "draft",
          sku: "PNT-WHT-1GAL",
          createdAt: "2024-01-05",
          updatedAt: "2024-01-05"
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "archived":
        return <Badge variant="destructive">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (stock < 10) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Low Stock</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedDashboardHeader title="Products" subtitle="Manage your product catalog" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your product catalog</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your catalog. Fill in all required fields.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" placeholder="Enter product name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter product description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" type="number" placeholder="0.00" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" placeholder="Enter SKU" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Product Image</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      <span className="text-sm text-gray-500">or drag and drop</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.filter(p => p.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">Currently selling</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.filter(p => p.stock < 10 && p.stock > 0).length}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Inventory value</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
              <CardDescription>
                View and manage all your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Products Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading products...
                        </TableCell>
                      </TableRow>
                    ) : filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={product.image} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {product.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>
                            {getStockBadge(product.stock)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(product.status)}
                          </TableCell>
                          <TableCell>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm">{product.rating}</span>
                                <span className="text-xs text-gray-500">({product.reviews})</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" title="View">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Delete">
                                <Trash2 className="h-4 w-4" />
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
