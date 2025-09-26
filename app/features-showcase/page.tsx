"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Zap, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Truck, 
  Package, 
  DollarSign,
  Brain,
  Target,
  Award,
  Globe,
  Shield,
  Clock,
  Star,
  Rocket,
  Eye,
  RefreshCw
} from "lucide-react"

export default function FeaturesShowcase() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const features = [
    {
      id: "ai-assistant",
      title: "AI-Powered Assistant",
      description: "Intelligent virtual assistant with natural language processing",
      icon: Brain,
      color: "bg-purple-500",
      features: [
        "Natural language queries",
        "Predictive recommendations",
        "Context-aware responses",
        "Multi-language support"
      ],
      demo: "Ask: 'What's the best concrete price in my area?'"
    },
    {
      id: "smart-costing",
      title: "Smart Cost Calculator",
      description: "AI-driven cost optimization with real-time market data",
      icon: DollarSign,
      color: "bg-green-500",
      features: [
        "Real-time price comparison",
        "Bulk discount calculation",
        "Transportation cost optimization",
        "Market trend analysis"
      ],
      demo: "Compare prices across 50+ suppliers instantly"
    },
    {
      id: "route-optimization",
      title: "Route Optimizer",
      description: "AI-powered delivery route planning with traffic consideration",
      icon: Truck,
      color: "bg-blue-500",
      features: [
        "Real-time traffic integration",
        "Multi-stop optimization",
        "Fuel efficiency calculation",
        "Delivery time prediction"
      ],
      demo: "Save 25% on fuel costs with optimized routes"
    },
    {
      id: "inventory-ai",
      title: "Inventory AI",
      description: "Predictive inventory management with demand forecasting",
      icon: Package,
      color: "bg-orange-500",
      features: [
        "Demand prediction algorithms",
        "Stock level optimization",
        "Automatic reordering",
        "Seasonal trend analysis"
      ],
      demo: "Reduce inventory costs by 30% with AI predictions"
    },
    {
      id: "real-time-messaging",
      title: "Real-time Messaging",
      description: "Instant communication with file sharing and status indicators",
      icon: MessageSquare,
      color: "bg-indigo-500",
      features: [
        "Instant message delivery",
        "File and image sharing",
        "User status indicators",
        "Group chat support"
      ],
      demo: "Connect with suppliers instantly across the platform"
    },
    {
      id: "advanced-analytics",
      title: "Advanced Analytics",
      description: "Comprehensive performance tracking with AI insights",
      icon: BarChart3,
      color: "bg-red-500",
      features: [
        "Real-time KPI tracking",
        "AI-powered insights",
        "Predictive analytics",
        "Custom report generation"
      ],
      demo: "Get actionable insights from your data patterns"
    }
  ]

  const aiFeatures = [
    {
      title: "Price Optimization",
      impact: "+15% savings",
      description: "AI analyzes market trends to find optimal pricing"
    },
    {
      title: "Demand Forecasting",
      impact: "+22% accuracy",
      description: "Predict future demand with machine learning"
    },
    {
      title: "Route Optimization",
      impact: "+18% efficiency",
      description: "AI plans the most efficient delivery routes"
    },
    {
      title: "Customer Matching",
      impact: "+8% conversion",
      description: "AI connects buyers with ideal suppliers"
    }
  ]

  const performanceMetrics = [
    {
      label: "Platform Uptime",
      value: "99.9%",
      icon: Shield,
      color: "text-green-600"
    },
    {
      label: "Response Time",
      value: "<200ms",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      label: "AI Accuracy",
      value: "94%",
      icon: Target,
      color: "text-purple-600"
    },
    {
      label: "User Satisfaction",
      value: "4.8/5",
      icon: Star,
      color: "text-yellow-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BBMS Advanced Features
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful AI-driven features that make BBMS the most advanced 
            building materials management platform on the market.
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${metric.color}`} />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.id} className="hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-purple-600 font-medium">
                        <Zap className="h-4 w-4" />
                        <span>Live Demo Available</span>
                      </div>
                      <ul className="space-y-2">
                        {feature.features.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 italic">"{feature.demo}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* AI Impact Section */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardHeader>
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 mr-3" />
                <CardTitle className="text-2xl">AI Impact on Your Business</CardTitle>
              </div>
              <CardDescription className="text-purple-100 text-lg">
                See how our AI-powered features deliver measurable results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-300 mb-2">{feature.impact}</div>
                    <div className="font-medium mb-2">{feature.title}</div>
                    <div className="text-sm text-purple-100">{feature.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center mb-4">
                <Eye className="h-8 w-8 text-purple-600 mr-3" />
                <CardTitle className="text-2xl">Interactive Demo</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Experience the features in action with our interactive demonstrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => setActiveDemo('cost-calculator')}
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Try Cost Calculator
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  onClick={() => setActiveDemo('route-optimizer')}
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Test Route Optimizer
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  onClick={() => setActiveDemo('analytics')}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Explore Analytics
                </Button>
              </div>
              
              {activeDemo && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Live Demo: {activeDemo}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveDemo(null)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Demo
                    </Button>
                  </div>
                  <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300 text-center text-gray-500">
                    <p>Interactive demo would load here</p>
                    <p className="text-sm mt-2">Navigate to the actual dashboard to experience the full functionality</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-gray-900 to-purple-900 text-white">
            <CardContent className="p-8">
              <Rocket className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                Join thousands of companies already using BBMS Advanced to streamline their 
                building materials management with AI-powered intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                  <Globe className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Award className="h-5 w-5 mr-2" />
                  View Case Studies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}