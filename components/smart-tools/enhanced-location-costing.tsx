"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, TrendingUp, Truck, Calculator, AlertTriangle } from "lucide-react"

const locationData = {
  mumbai: {
    name: "Mumbai",
    baseCostMultiplier: 1.2,
    transportCost: 150,
    laborCost: 800,
    permitCost: 500,
    zones: ["South Mumbai", "Central Mumbai", "Western Suburbs", "Eastern Suburbs"],
    nearbySuppliers: 45,
    averageDistance: 8.5,
  },
  delhi: {
    name: "Delhi",
    baseCostMultiplier: 1.1,
    transportCost: 120,
    laborCost: 750,
    permitCost: 300,
    zones: ["Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    nearbySuppliers: 38,
    averageDistance: 12.2,
  },
  bangalore: {
    name: "Bangalore",
    baseCostMultiplier: 1.0,
    transportCost: 100,
    laborCost: 650,
    permitCost: 200,
    zones: ["Central Bangalore", "North Bangalore", "South Bangalore", "East Bangalore", "West Bangalore"],
    nearbySuppliers: 32,
    averageDistance: 15.8,
  },
}

const materialPrices = {
  "Premium Red Bricks": { basePrice: 8.5, unit: "per piece", category: "bricks" },
  "OPC Cement 50kg": { basePrice: 420, unit: "per bag", category: "cement" },
  "River Sand": { basePrice: 1200, unit: "per ton", category: "sand" },
  "Concrete Blocks": { basePrice: 45, unit: "per piece", category: "blocks" },
  "TMT Steel Rods": { basePrice: 65000, unit: "per ton", category: "steel" },
}

export default function EnhancedLocationCosting() {
  const [selectedLocation, setSelectedLocation] = useState("mumbai")
  const [selectedZone, setSelectedZone] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState("Premium Red Bricks")
  const [quantity, setQuantity] = useState("1000")
  const [deliveryUrgency, setDeliveryUrgency] = useState("standard")

  const locationInfo = locationData[selectedLocation as keyof typeof locationData]
  const materialInfo = materialPrices[selectedMaterial as keyof typeof materialPrices]

  const calculateLocationCost = () => {
    const basePrice = materialInfo.basePrice * Number.parseInt(quantity)
    const locationAdjustedPrice = basePrice * locationInfo.baseCostMultiplier

    let transportMultiplier = 1
    if (deliveryUrgency === "express") transportMultiplier = 1.5
    if (deliveryUrgency === "economy") transportMultiplier = 0.8

    const transportCost = locationInfo.transportCost * transportMultiplier
    const laborCost = locationInfo.laborCost
    const permitCost = locationInfo.permitCost

    const totalCost = locationAdjustedPrice + transportCost + laborCost + permitCost

    return {
      basePrice,
      locationAdjustedPrice,
      transportCost,
      laborCost,
      permitCost,
      totalCost,
    }
  }

  const costs = calculateLocationCost()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Enhanced Location-Based Costing
        </CardTitle>
        <CardDescription>
          Precise cost calculation with location-specific factors and real-time adjustments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Zone</label>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {locationInfo.zones.map((zone) => (
                  <SelectItem key={zone} value={zone.toLowerCase().replace(/\s+/g, "-")}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Material</label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(materialPrices).map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Calculator className="h-4 w-4" />
                <span className="text-sm font-medium">Base Cost</span>
              </div>
              <p className="text-2xl font-bold">₹{costs.basePrice.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">material only</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Location Adjusted</span>
              </div>
              <p className="text-2xl font-bold">₹{costs.locationAdjustedPrice.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {((locationInfo.baseCostMultiplier - 1) * 100).toFixed(0)}% adjustment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Truck className="h-4 w-4" />
                <span className="text-sm font-medium">Transport Cost</span>
              </div>
              <p className="text-2xl font-bold">₹{costs.transportCost.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{deliveryUrgency} delivery</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-purple-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Total Cost</span>
              </div>
              <p className="text-2xl font-bold">₹{costs.totalCost.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">all inclusive</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nearby Suppliers:</span>
                  <Badge variant="outline">{locationInfo.nearbySuppliers} suppliers</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Distance:</span>
                  <span className="font-medium">{locationInfo.averageDistance} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Labor Rate:</span>
                  <span className="font-medium">₹{locationInfo.laborCost}/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Permit Cost:</span>
                  <span className="font-medium">₹{locationInfo.permitCost}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Location Benefits</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• High supplier density in this area</li>
                  <li>• Good transport connectivity</li>
                  <li>• Competitive local pricing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Material Cost:</span>
                  <span className="font-medium">₹{costs.locationAdjustedPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Transport & Delivery:</span>
                  <span className="font-medium">₹{costs.transportCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Labor Charges:</span>
                  <span className="font-medium">₹{costs.laborCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Permits & Fees:</span>
                  <span className="font-medium">₹{costs.permitCost.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Cost:</span>
                    <span>₹{costs.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Urgency</label>
                <Select value={deliveryUrgency} onValueChange={setDeliveryUrgency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="express">Express (+50% transport cost)</SelectItem>
                    <SelectItem value="standard">Standard (normal cost)</SelectItem>
                    <SelectItem value="economy">Economy (-20% transport cost)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {locationInfo.baseCostMultiplier > 1.1 && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">High Cost Location Alert</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  This location has higher than average costs. Consider nearby areas or bulk ordering to optimize
                  expenses.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button className="flex-1">Get Detailed Quote</Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Compare with Other Locations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
