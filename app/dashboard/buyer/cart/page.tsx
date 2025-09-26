"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  MapPin, 
  Truck, 
  CreditCard, 
  Calculator,
  Heart,
  ArrowRight
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  supplier: string
  location: string
  unit: string
  stock: number
  deliveryTime: string
}

export default function BuyerCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    loadCart()
  }, [user])

  const loadCart = () => {
    const savedCart = localStorage.getItem(`cart_${user?.id}`)
    if (savedCart) {
      const cartData = JSON.parse(savedCart)
      // Convert cart object to array format
      const itemsArray: CartItem[] = Object.entries(cartData).map(([id, quantity]: [string, any]) => ({
        id,
        name: getProductDetails(id)?.name || "Unknown Product",
        price: getProductDetails(id)?.price || 0,
        quantity: typeof quantity === 'number' ? quantity : quantity.quantity || 1,
        image: getProductDetails(id)?.image || "/placeholder.svg",
        supplier: getProductDetails(id)?.supplier || "Unknown Supplier",
        location: getProductDetails(id)?.location || "Unknown Location",
        unit: getProductDetails(id)?.unit || "per unit",
        stock: getProductDetails(id)?.stock || 0,
        deliveryTime: getProductDetails(id)?.deliveryTime || "3-5 days"
      }))
      setCartItems(itemsArray)
    }
    setLoading(false)
  }

  const getProductDetails = (productId: string) => {
    const mockProducts = {
      "1": {
        name: "Premium Red Bricks",
        price: 8.5,
        image: "/concrete-blocks-construction.jpg",
        supplier: "Local Brick Co.",
        location: "Industrial Area",
        unit: "per piece",
        stock: 25000,
        deliveryTime: "2-3 days"
      },
      "2": {
        name: "OPC Cement 50kg",
        price: 420,
        image: "/placeholder.svg",
        supplier: "BuildMart",
        location: "City Center",
        unit: "per bag",
        stock: 500,
        deliveryTime: "1-2 days"
      },
      "3": {
        name: "TMT Steel Rods 12mm",
        price: 65,
        image: "/placeholder.svg",
        supplier: "Steel Works Ltd.",
        location: "Steel Township",
        unit: "per kg",
        stock: 1500,
        deliveryTime: "3-4 days"
      }
    }
    return mockProducts[productId as keyof typeof mockProducts]
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const item = cartItems.find(item => item.id === productId)
    if (item && newQuantity > item.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${item.stock} units available`,
        variant: "destructive"
      })
      return
    }

    const updatedItems = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedItems)
    
    // Update localStorage
    const cartObject = updatedItems.reduce((acc, item) => {
      acc[item.id] = item.quantity
      return acc
    }, {} as Record<string, number>)
    
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(cartObject))
  }

  const removeItem = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== productId)
    setCartItems(updatedItems)
    
    // Update localStorage
    const cartObject = updatedItems.reduce((acc, item) => {
      acc[item.id] = item.quantity
      return acc
    }, {} as Record<string, number>)
    
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(cartObject))
    
    toast({
      title: "Item Removed",
      description: "Product removed from cart"
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem(`cart_${user?.id}`)
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart"
    })
  }

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getDeliveryCharges = () => {
    const subtotal = getSubtotal()
    return subtotal > 50000 ? 0 : 500 // Free delivery above ₹50,000
  }

  const getTotal = () => {
    return getSubtotal() + getDeliveryCharges()
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getSavings = () => {
    // Calculate savings based on bulk orders or fair algorithm
    const subtotal = getSubtotal()
    if (subtotal > 100000) return subtotal * 0.05 // 5% discount above ₹1L
    if (subtotal > 50000) return subtotal * 0.03 // 3% discount above ₹50K
    return 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Package className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">Review and manage your selected items</p>
          </div>
          <Link href="/dashboard/buyer/products">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some construction materials to get started</p>
            <Link href="/dashboard/buyer/products">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {getTotalItems()} items • ₹{getSubtotal().toLocaleString()} total value
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
          <Link href="/dashboard/buyer/products">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
              <CardDescription>
                Review your selected construction materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{item.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <MapPin className="h-3 w-3" />
                                <span>{item.supplier} • {item.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Truck className="h-3 w-3" />
                                <span>Delivery: {item.deliveryTime}</span>
                              </div>
                              <Badge variant="secondary" className="mt-2">
                                Stock: {item.stock.toLocaleString()} units
                              </Badge>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-20 text-center h-8"
                                min="1"
                                max={item.stock}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm text-muted-foreground ml-2">
                                {item.unit}
                              </span>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-lg font-semibold">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ₹{item.price.toLocaleString()} per {item.unit.split(' ').pop()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₹{getSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={getDeliveryCharges() === 0 ? "text-green-600" : ""}>
                    {getDeliveryCharges() === 0 ? "Free" : `₹${getDeliveryCharges().toLocaleString()}`}
                  </span>
                </div>
                {getSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Discount (Fair Algorithm)</span>
                    <span>-₹{getSavings().toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{(getTotal() - getSavings()).toLocaleString()}</span>
                </div>
              </div>
              
              <Button className="w-full" size="lg">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  💡 Add ₹{(50000 - getSubtotal()).toLocaleString()} more for free delivery
                </p>
              </div>
              {getSubtotal() < 50000 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    🎯 Add ₹{(50000 - getSubtotal()).toLocaleString()} more for 3% bulk discount
                  </p>
                </div>
              )}
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-900">
                  ⚡ Fastest delivery available in {Math.min(...cartItems.map(item => parseInt(item.deliveryTime)))} days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
