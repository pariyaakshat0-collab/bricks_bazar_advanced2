"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  ShoppingCart,
  Calculator,
  TrendingUp,
  Package,
  Truck,
  DollarSign,
  AlertCircle,
  Lightbulb,
  Search,
  Settings,
  History,
  Star,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import { EnhancedDashboardHeader } from "@/components/shared/enhanced-dashboard-header"

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  actions?: Array<{
    label: string
    action: string
    icon?: any
  }>
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  category: 'orders' | 'inventory' | 'pricing' | 'shipping' | 'general'
}

export default function SmartAssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null)

  const quickActions: QuickAction[] = [
    {
      id: 'track-order',
      title: 'Track My Order',
      description: 'Get real-time order status and delivery updates',
      icon: Package,
      category: 'orders'
    },
    {
      id: 'cost-estimate',
      title: 'Estimate Costs',
      description: 'Calculate total costs including shipping and taxes',
      icon: Calculator,
      category: 'pricing'
    },
    {
      id: 'price-trends',
      title: 'Price Trends',
      description: 'Analyze price trends for materials and products',
      icon: TrendingUp,
      category: 'pricing'
    },
    {
      id: 'inventory-check',
      title: 'Check Inventory',
      description: 'Check availability and stock levels',
      icon: Package,
      category: 'inventory'
    },
    {
      id: 'shipping-options',
      title: 'Shipping Options',
      description: 'Compare shipping methods and delivery times',
      icon: Truck,
      category: 'shipping'
    },
    {
      id: 'bulk-discounts',
      title: 'Bulk Discounts',
      description: 'Find bulk purchase discounts and deals',
      icon: DollarSign,
      category: 'pricing'
    }
  ]

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: `Hello ${user?.name || 'there'}! 👋 I'm your smart construction assistant. I can help you with:

• Tracking orders and deliveries
• Estimating costs and calculating totals
• Analyzing price trends and finding deals
• Checking inventory and availability
• Comparing shipping options
• Finding bulk discounts

What can I help you with today?`,
      timestamp: new Date(),
      suggestions: [
        "Track my latest order",
        "Estimate costs for materials",
        "Show me price trends",
        "Check inventory levels"
      ]
    }
    setMessages([welcomeMessage])
  }, [user?.name])

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId)
    if (action) {
      setSelectedQuickAction(actionId)
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: action.title,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      
      // Simulate assistant response
      setIsTyping(true)
      setTimeout(() => {
        let assistantResponse: Message
        
        switch (actionId) {
          case 'track-order':
            assistantResponse = {
              id: (Date.now() + 1).toString(),
              type: 'assistant',
              content: 'I can help you track your orders. Let me show you your recent orders with their current status and estimated delivery times.',
              timestamp: new Date(),
              actions: [
                { label: 'View All Orders', action: 'view-orders', icon: Package },
                { label: 'Track by Order ID', action: 'track-by-id', icon: Search }
              ]
            }
            break
          case 'cost-estimate':
            assistantResponse = {
              id: (Date.now() + 1).toString(),
              type: 'assistant',
              content: 'I can help you estimate costs for your construction materials. Would you like me to calculate costs for a specific project or material type?',
              timestamp: new Date(),
              actions: [
                { label: 'Use Cost Calculator', action: 'open-calculator', icon: Calculator },
                { label: 'Get Bulk Quote', action: 'bulk-quote', icon: DollarSign }
              ]
            }
            break
          case 'price-trends':
            assistantResponse = {
              id: (Date.now() + 1).toString(),
              type: 'assistant',
              content: 'I can analyze price trends for construction materials. Here are the current market trends and price predictions for popular materials.',
              timestamp: new Date(),
              actions: [
                { label: 'View Price Charts', action: 'view-charts', icon: TrendingUp },
                { label: 'Set Price Alerts', action: 'price-alerts', icon: AlertCircle }
              ]
            }
            break
          default:
            assistantResponse = {
              id: (Date.now() + 1).toString(),
              type: 'assistant',
              content: `Great choice! I can help you with ${action.title}. Let me get that information for you.`,
              timestamp: new Date()
            }
        }
        
        setMessages(prev => [...prev, assistantResponse])
        setIsTyping(false)
      }, 1500)
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputMessage,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      setInputMessage('')
      
      // Simulate assistant response
      setIsTyping(true)
      setTimeout(() => {
        const assistantResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `I understand you're asking about "${inputMessage}". I'm processing your request and will provide you with relevant information and suggestions.`,
          timestamp: new Date(),
          suggestions: [
            "Tell me more",
            "Show me options",
            "Get expert advice",
            "Save this for later"
          ]
        }
        setMessages(prev => [...prev, assistantResponse])
        setIsTyping(false)
      }, 2000)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleActionClick = (action: string) => {
    console.log('Action clicked:', action)
    // Handle different actions
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedDashboardHeader title="AI Assistant" subtitle="Your smart construction assistant" />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Assistant</h1>
                <p className="text-gray-600">Your AI-powered construction materials assistant</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Get instant help with common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant={selectedQuickAction === action.id ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleQuickAction(action.id)}
                      >
                        <div className="flex items-center gap-3">
                          <action.icon className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{action.title}</div>
                            <div className="text-xs text-gray-500">{action.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Ask about bulk discounts for better pricing</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Compare shipping options to save on delivery costs</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Set price alerts for materials you're watching</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Assistant Chat
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.type === 'assistant' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100">
                                <Bot className="h-4 w-4 text-blue-600" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`max-w-[70%] ${message.type === 'user' ? 'order-1' : ''}`}>
                            <div className={`rounded-lg px-4 py-2 ${
                              message.type === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm whitespace-pre-line">{message.content}</p>
                            </div>
                            
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                            
                            {message.actions && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {message.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => handleActionClick(action.action)}
                                  >
                                    {action.icon && <action.icon className="h-3 w-3 mr-1" />}
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                          
                          {message.type === 'user' && (
                            <Avatar className="h-8 w-8 order-2">
                              <AvatarFallback className="bg-gray-200">
                                <User className="h-4 w-4 text-gray-600" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex gap-3 justify-start">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100">
                              <Bot className="h-4 w-4 text-blue-600" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="bg-gray-100 rounded-lg px-4 py-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  {/* Input Area */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}