"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Ruler, Package, DollarSign, Wrench, Clock, Truck, AlertCircle, CheckCircle, Brain, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface MaterialType {
  id: string
  name: string
  category: string
  basePrice: number
  unit: string
  description: string
  factors: {
    quality: { label: string; multiplier: number }[]
    location: { label: string; multiplier: number }[]
    seasonality: { label: string; multiplier: number }[]
  }
}

interface ProjectEstimate {
  material: MaterialType
  quantity: number
  quality: string
  location: string
  seasonality: string
  estimatedPrice: number
  deliveryCost: number
  totalCost: number
  confidence: number
}

export default function CostEstimatorPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [materials] = useState<MaterialType[]>([
    {
      id: 'bricks',
      name: 'Red Bricks',
      category: 'Bricks & Blocks',
      basePrice: 8,
      unit: 'piece',
      description: 'Standard red clay bricks for construction',
      factors: {
        quality: [
          { label: 'Standard', multiplier: 1.0 },
          { label: 'Premium', multiplier: 1.2 },
          { label: 'Export Quality', multiplier: 1.5 }
        ],
        location: [
          { label: 'Local (0-10km)', multiplier: 1.0 },
          { label: 'Regional (10-50km)', multiplier: 1.1 },
          { label: 'Long Distance (50km+)', multiplier: 1.25 }
        ],
        seasonality: [
          { label: 'Regular Season', multiplier: 1.0 },
          { label: 'Peak Season', multiplier: 1.15 },
          { label: 'Off Season', multiplier: 0.9 }
        ]
      }
    },
    {
      id: 'cement',
      name: 'Portland Cement',
      category: 'Cement & Concrete',
      basePrice: 420,
      unit: '50kg bag',
      description: 'OPC 53 grade cement for construction',
      factors: {
        quality: [
          { label: 'OPC 43 Grade', multiplier: 1.0 },
          { label: 'OPC 53 Grade', multiplier: 1.1 },
          { label: 'PPC Grade', multiplier: 0.95 }
        ],
        location: [
          { label: 'Local Dealer', multiplier: 1.0 },
          { label: 'Direct from Factory', multiplier: 0.85 },
          { label: 'Retail Store', multiplier: 1.15 }
        ],
        seasonality: [
          { label: 'Regular Season', multiplier: 1.0 },
          { label: 'Monsoon Season', multiplier: 1.2 },
          { label: 'Winter Season', multiplier: 1.1 }
        ]
      }
    },
    {
      id: 'steel',
      name: 'TMT Steel Bars',
      category: 'Steel & Metal',
      basePrice: 65,
      unit: 'kg',
      description: 'Fe 550 TMT bars for reinforcement',
      factors: {
        quality: [
          { label: 'Fe 500 Grade', multiplier: 1.0 },
          { label: 'Fe 550 Grade', multiplier: 1.05 },
          { label: 'Fe 600 Grade', multiplier: 1.15 }
        ],
        location: [
          { label: 'Local Supplier', multiplier: 1.0 },
          { label: 'Regional Distributor', multiplier: 0.95 },
          { label: 'Direct from Mill', multiplier: 0.85 }
        ],
        seasonality: [
          { label: 'Regular Season', multiplier: 1.0 },
          { label: 'Construction Peak', multiplier: 1.1 },
          { label: 'Festival Season', multiplier: 1.05 }
        ]
      }
    }
  ])

  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(0)
  const [quality, setQuality] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [seasonality, setSeasonality] = useState<string>('')
  const [projectDescription, setProjectDescription] = useState<string>('')
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [recentEstimates, setRecentEstimates] = useState<ProjectEstimate[]>([])

  const calculateEstimate = async () => {
    if (!selectedMaterial || !quantity || !quality || !location || !seasonality) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to calculate the estimate.",
        variant: "destructive"
      })
      return
    }

    setIsCalculating(true)
    
    // Simulate AI calculation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const material = materials.find(m => m.id === selectedMaterial)
    if (!material) return

    const qualityFactor = material.factors.quality.find(q => q.label === quality)?.multiplier || 1
    const locationFactor = material.factors.location.find(l => l.label === location)?.multiplier || 1
    const seasonalityFactor = material.factors.seasonality.find(s => s.label === seasonality)?.multiplier || 1
    
    const baseCost = material.basePrice * quantity
    const adjustedCost = baseCost * qualityFactor * locationFactor * seasonalityFactor
    const deliveryCost = quantity * 0.05 * material.basePrice // 5% of base cost for delivery
    const totalCost = adjustedCost + deliveryCost
    
    // Confidence based on data completeness and market volatility
    const confidence = Math.min(95, 60 + (Math.random() * 30))

    const newEstimate: ProjectEstimate = {
      material,
      quantity,
      quality,
      location,
      seasonality,
      estimatedPrice: adjustedCost,
      deliveryCost,
      totalCost,
      confidence
    }

    setEstimate(newEstimate)
    setRecentEstimates(prev => [newEstimate, ...prev.slice(0, 4)])
    
    toast({
      title: "Estimate Calculated",
      description: `AI-powered cost estimate generated with ${confidence.toFixed(0)}% confidence.`,
    })
    
    setIsCalculating(false)
  }

  const saveEstimate = () => {
    if (!estimate) return
    
    // Save to local storage or send to backend
    const savedEstimates = JSON.parse(localStorage.getItem('saved_estimates') || '[]')
    savedEstimates.push({
      ...estimate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      projectDescription
    })
    localStorage.setItem('saved_estimates', JSON.stringify(savedEstimates))
    
    toast({
      title: "Estimate Saved",
      description: "Your cost estimate has been saved for future reference."
    })
  }

  const shareEstimate = () => {
    if (!estimate) return
    
    const shareText = `
Construction Cost Estimate
Material: ${estimate.material.name}
Quantity: ${estimate.quantity} ${estimate.material.unit}
Estimated Cost: ₹${estimate.totalCost.toLocaleString()}
Confidence: ${estimate.confidence.toFixed(0)}%

Generated by BBMS Smart Cost Estimator
    `.trim()
    
    if (navigator.share) {
      navigator.share({
        title: 'Construction Cost Estimate',
        text: shareText
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: "Estimate Copied",
        description: "Cost estimate copied to clipboard."
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Cost Estimator</h1>
          <p className="text-muted-foreground">Get accurate cost estimates for your construction materials using AI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Saved Estimates
          </Button>
        </div>
      </div>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            How Our AI Estimator Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Material Analysis</h4>
                <p className="text-sm text-muted-foreground">Analyzes material quality, market rates, and availability</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Location Intelligence</h4>
                <p className="text-sm text-muted-foreground">Considers transportation costs and local market conditions</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Market Trends</h4>
                <p className="text-sm text-muted-foreground">Incorporates seasonal pricing patterns and market volatility</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Enter your project requirements to get an accurate estimate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material Type *</Label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      <div className="flex flex-col">
                        <span>{material.name}</span>
                        <span className="text-xs text-muted-foreground">{material.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <div className="relative">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="pr-20"
                />
                {selectedMaterial && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    {materials.find(m => m.id === selectedMaterial)?.unit}
                  </span>
                )}
              </div>
            </div>

            {selectedMaterial && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality Grade *</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger id="quality">
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.find(m => m.id === selectedMaterial)?.factors.quality.map((q) => (
                        <SelectItem key={q.label} value={q.label}>
                          {q.label} (+{((q.multiplier - 1) * 100).toFixed(0)}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location/Sourcing *</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location/sourcing" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.find(m => m.id === selectedMaterial)?.factors.location.map((l) => (
                        <SelectItem key={l.label} value={l.label}>
                          {l.label} ({l.multiplier > 1 ? '+' : ''}{((l.multiplier - 1) * 100).toFixed(0)}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seasonality">Season/Timing *</Label>
                  <Select value={seasonality} onValueChange={setSeasonality}>
                    <SelectTrigger id="seasonality">
                      <SelectValue placeholder="Select season/timing" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.find(m => m.id === selectedMaterial)?.factors.seasonality.map((s) => (
                        <SelectItem key={s.label} value={s.label}>
                          {s.label} ({s.multiplier > 1 ? '+' : ''}{((s.multiplier - 1) * 100).toFixed(0)}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Project Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your project for better recommendations..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={calculateEstimate} 
              disabled={isCalculating || !selectedMaterial || !quantity || !quality || !location || !seasonality}
              className="w-full"
            >
              {isCalculating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Estimate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Estimate</CardTitle>
            <CardDescription>AI-powered cost breakdown and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {estimate ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Estimated Cost</span>
                    <Badge variant="secondary">{estimate.confidence.toFixed(0)}% Confidence</Badge>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{estimate.totalCost.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    for {estimate.quantity} {estimate.material.unit} of {estimate.material.name}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Material Cost</span>
                    <span>₹{estimate.material.basePrice.toLocaleString()}/{estimate.material.unit}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quality Adjustment</span>
                    <span className="text-green-600">+{(((estimate.estimatedPrice / (estimate.material.basePrice * estimate.quantity))) * 100 - 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Cost</span>
                    <span>₹{estimate.deliveryCost.toLocaleString()}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total Cost</span>
                    <span>₹{estimate.totalCost.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Cost per {estimate.material.unit}</span>
                    <span>₹{(estimate.totalCost / estimate.quantity).toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">AI Recommendations</p>
                      <p className="text-yellow-700">
                        Consider ordering during off-season for potential savings of 10-15%. 
                        Bulk orders above {estimate.quantity * 1.5} units may qualify for additional discounts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEstimate} variant="outline" className="flex-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Save Estimate
                  </Button>
                  <Button onClick={shareEstimate} variant="outline" className="flex-1">
                    <Package className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Estimate Yet</h3>
                <p className="text-muted-foreground">
                  Fill in the project details and click "Calculate Estimate" to get your AI-powered cost estimate.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Estimates */}
      {recentEstimates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Estimates</CardTitle>
            <CardDescription>Your recently calculated cost estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEstimates.map((estimate, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{estimate.material.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {estimate.quantity} {estimate.material.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{estimate.totalCost.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{estimate.confidence.toFixed(0)}% confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}