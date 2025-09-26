"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

const priceData = [
  {
    product: "Premium Red Bricks",
    suppliers: [
      { name: "Local Brick Co.", price: 8.5, rating: 4.8, verified: true, distance: "2.3 km" },
      { name: "BuildMart", price: 9.2, rating: 4.6, verified: true, distance: "5.1 km" },
      { name: "QuickBuild Materials", price: 7.8, rating: 3.9, verified: false, distance: "8.7 km" },
      { name: "Premium Suppliers", price: 10.1, rating: 4.9, verified: true, distance: "12.4 km" },
    ],
  },
]

export default function PriceComparison() {
  const [selectedProduct, setSelectedProduct] = useState("Premium Red Bricks")
  const [quantity, setQuantity] = useState("1000")

  const currentData = priceData.find((p) => p.product === selectedProduct)
  const suppliers = currentData?.suppliers || []
  const bestPrice = Math.min(...suppliers.map((s) => s.price))
  const avgPrice = suppliers.reduce((sum, s) => sum + s.price, 0) / suppliers.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Smart Price Comparison
        </CardTitle>
        <CardDescription>Compare prices across verified suppliers and find the best deals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Product</label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Premium Red Bricks">Premium Red Bricks</SelectItem>
                <SelectItem value="OPC Cement 50kg">OPC Cement 50kg</SelectItem>
                <SelectItem value="River Sand">River Sand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">Best Price</span>
              </div>
              <p className="text-2xl font-bold">₹{bestPrice.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">per piece</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Market Average</span>
              </div>
              <p className="text-2xl font-bold">₹{avgPrice.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">per piece</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Potential Savings</span>
              </div>
              <p className="text-2xl font-bold">₹{((avgPrice - bestPrice) * Number.parseInt(quantity)).toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">total savings</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Supplier Comparison</h3>
          {suppliers.map((supplier, index) => (
            <div key={supplier.name} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{supplier.name}</h4>
                  {supplier.verified && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {supplier.price === bestPrice && <Badge variant="secondary">Best Price</Badge>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{supplier.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">per piece</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Rating: {supplier.rating}/5.0</span>
                <span>Distance: {supplier.distance}</span>
                <span>Total: ₹{(supplier.price * Number.parseInt(quantity)).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full">Get Detailed Quotes from All Suppliers</Button>
      </CardContent>
    </Card>
  )
}
