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
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"
import { EnhancedDashboardHeader } from "@/components/shared/enhanced-dashboard-header"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  reorderPoint: number
  unit: string
  lastRestocked: string
  status: "optimal" | "low" | "critical" | "overstock"
  demandTrend: "increasing" | "stable" | "decreasing"
  predictedDemand: number
  supplier: string
  unitCost: number
  totalValue: number
}

export default function SmartInventoryPage() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    // Simulate loading inventory data
    setTimeout(() => {
      setInventory([
        {
          id: "1",
          name: "Premium Red Bricks",
          category: "Bricks",
          currentStock: 25000,
          minStock: 5000,
          maxStock: 30000,
          reorderPoint: 8000,
          unit: "pieces",
          lastRestocked: "2024-01-15",
          status: "optimal",
          demandTrend: "stable",
          predictedDemand: 1200,
          supplier: "Delhi Brick Works",
          unitCost: 8.5,
          totalValue: 212500
        },
        {
          id: "2",
          name: "OPC Cement 50kg",
          category: "Cement",
          currentStock: 8,
          minStock: 20,
          maxStock: 100,
          reorderPoint: 25,
          unit: "bags",
          lastRestocked: "2024-01-10",
          status: "critical",
          demandTrend: "increasing",
          predictedDemand: 45,
          supplier: "UltraTech Cement",
          unitCost: 420,
          totalValue: 3360
        },
        {
          id: "3",
          name: "TMT Steel Rods 12mm",
          category: "Steel",
          currentStock: 0,
          minStock: 100,
          maxStock: 500,
          reorderPoint: 150,
          unit: "kg",
          lastRestocked: "2024-01-05",
          status: "critical",
          demandTrend: "increasing",
          predictedDemand: 200,
          supplier: "Steel Authority",
          unitCost: 65,
          totalValue: 0
        },
        {
          id: "4",
          name: "River Sand",
          category: "Sand",
          currentStock: 15000,
          minStock: 10000,
          maxStock: 20000,
          reorderPoint: 12000,
          unit: "kg",
          lastRestocked: "2024-01-12",
          status: "optimal",
          demandTrend: "stable",
          predictedDemand: 800,
          supplier: "Sand Suppliers Co.",
          unitCost: 1.2,
          totalValue: 18000
        },
        {
          id: "5",
          name: "Concrete Blocks",
          category: "Blocks",
          currentStock: 1200,
          minStock: 500,
          maxStock: 2000,
          reorderPoint: 800,
          unit: "pieces",
          lastRestocked: "2024-01-08",
          status: "optimal",
          demandTrend: "decreasing",
          predictedDemand: 300,
          supplier: "Block Works Ltd",
          unitCost: 45,
          totalValue: 54000
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const categories = ["all", "Bricks", "Cement", "Steel", "Sand", "Blocks"]

  const filteredInventory = selectedCategory === "all" 
    ? inventory 
    : inventory.filter(item => item.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800"
      case "low":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "overstock":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 text-gray-400">—</div>
    }
  }

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
  const criticalItems = inventory.filter(item => item.status === "critical").length
  const lowStockItems = inventory.filter(item => item.status === "low").length

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedDashboardHeader title="Smart Inventory" subtitle="AI-powered inventory management" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Inventory</h1>
              <p className="text-gray-600">AI-powered inventory management and optimization</p>
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
                Add Item
              </Button>
            </div>
          </div>

          {/* Alert Cards */}
          {criticalItems > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Critical Stock Alert</AlertTitle>
              <AlertDescription>
                {criticalItems} items are critically low on stock and need immediate attention.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventory.length}</div>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Inventory investment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
                <p className="text-xs text-muted-foreground">Need immediate restock</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Below reorder point</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>
                AI-powered insights for optimal inventory management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1"></div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>

              {/* Inventory Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Demand Trend</TableHead>
                      <TableHead>Predicted Demand</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Loading inventory data...
                        </TableCell>
                      </TableRow>
                    ) : filteredInventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.category}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${
                                item.currentStock === 0 ? 'text-red-600' : 
                                item.currentStock <= item.reorderPoint ? 'text-yellow-600' : 
                                'text-green-600'
                              }`}>
                                {item.currentStock.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500">{item.unit}</span>
                            </div>
                            <Progress 
                              value={(item.currentStock / item.maxStock) * 100} 
                              className="h-2 mt-1"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(item.demandTrend)}
                              <span className="text-sm capitalize">{item.demandTrend}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.predictedDemand.toLocaleString()}</span>
                              <span className="text-sm text-gray-500">{item.unit}/month</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{item.supplier}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">${item.unitCost}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">${item.totalValue.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" title="View Details">
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