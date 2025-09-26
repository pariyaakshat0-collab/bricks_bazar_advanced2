"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Filter, Star, MapPin, Package, TrendingUp, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  unit: string
  rating: number
  reviews: number
  supplier: string
  location: string
  distance: number
  stock: number
  image: string
  description: string
  features: string[]
  certifications: string[]
  deliveryTime: string
  discount?: number
  fairScore: number
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Red Bricks",
    category: "Bricks",
    price: 8.5,
    originalPrice: 10.0,
    unit: "per piece",
    rating: 4.8,
    reviews: 156,
    supplier: "Local Brick Co.",
    location: "Industrial Area",
    distance: 2.5,
    stock: 25000,
    image: "/concrete-blocks-construction.jpg",
    description: "High-quality red bricks with excellent compressive strength",
    features: ["ISI Certified", "High Strength", "Uniform Size", "Weather Resistant"],
    certifications: ["ISI", "BIS"],
    deliveryTime: "2-3 days",
    discount: 15,
    fairScore: 92
  },
  {
    id: "2",
    name: "OPC Cement 50kg",
    category: "Cement",
    price: 420,
    unit: "per bag",
    rating: 4.6,
    reviews: 89,
    supplier: "BuildMart",
    location: "City Center",
    distance: 5.2,
    stock: 500,
    image: "/placeholder.svg",
    description: "Ordinary Portland Cement for general construction purposes",
    features: ["53 Grade", "Quick Setting", "High Strength", "Weather Resistant"],
    certifications: ["ISI", "ISO 9001"],
    deliveryTime: "1-2 days",
    fairScore: 88
  },
  {
    id: "3",
    name: "TMT Steel Rods 12mm",
    category: "Steel",
    price: 65,
    unit: "per kg",
    rating: 4.9,
    reviews: 203,
    supplier: "Steel Works Ltd.",
    location: "Steel Township",
    distance: 8.7,
    stock: 1500,
    image: "/placeholder.svg",
    description: "Thermo-Mechanically Treated steel rods for reinforced concrete",
    features: ["Corrosion Resistant", "High Ductility", "Earthquake Resistant", "BIS Certified"],
    certifications: ["BIS", "ISO 14001"],
    deliveryTime: "3-4 days",
    fairScore: 95
  },
  {
    id: "4",
    name: "River Sand",
    category: "Sand",
    price: 1200,
    unit: "per ton",
    rating: 4.3,
    reviews: 67,
    supplier: "Sand Suppliers Co.",
    location: "River Bank",
    distance: 12.3,
    stock: 100,
    image: "/placeholder.svg",
    description: "Fine river sand ideal for construction and concrete mixing",
    features: ["Clean", "Fine Graded", "Moisture Controlled", "Silt Free"],
    certifications: ["Quality Tested"],
    deliveryTime: "2-3 days",
    fairScore: 85
  },
  {
    id: "5",
    name: "Concrete Blocks",
    category: "Blocks",
    price: 45,
    unit: "per piece",
    originalPrice: 50,
    rating: 4.5,
    reviews: 124,
    supplier: "Block Makers Inc.",
    location: "Industrial Zone",
    distance: 6.1,
    stock: 8000,
    image: "/concrete-blocks-construction.jpg",
    description: "Hollow concrete blocks for wall construction",
    features: ["Lightweight", "Thermal Insulation", "Sound Proof", "Fire Resistant"],
    certifications: ["ISI", "Eco Certified"],
    deliveryTime: "1-2 days",
    discount: 10,
    fairScore: 90
  }
]

export default function BuyerProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("fair-score")
  const [cart, setCart] = useState<{[key: string]: number}>({})
  const [wishlist, setWishlist] = useState<string[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  const categories = ["all", "Bricks", "Cement", "Steel", "Sand", "Blocks", "Tiles", "Paint"]

  useEffect(() => {
    // Load cart and wishlist from localStorage
    const savedCart = localStorage.getItem(`cart_${user?.id}`)
    const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`)
    
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [user])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "distance":
        return a.distance - b.distance
      case "fair-score":
        return b.fairScore - a.fairScore
      default:
        return 0
    }
  })

  const addToCart = (productId: string, quantity: number = 1) => {
    const newCart = { ...cart }
    newCart[productId] = (newCart[productId] || 0) + quantity
    setCart(newCart)
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(newCart))
    
    toast({
      title: "Added to Cart",
      description: "Product added to your shopping cart",
    })
  }

  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId]
    
    setWishlist(newWishlist)
    localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(newWishlist))
    
    toast({
      title: wishlist.includes(productId) ? "Removed from Wishlist" : "Added to Wishlist",
      description: wishlist.includes(productId) ? "Product removed from wishlist" : "Product added to wishlist",
    })
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Construction Materials</h1>
          <p className="text-muted-foreground">Find the best materials for your project</p>
        </div>
        <Link href="/dashboard/buyer/cart">
          <Button variant="outline" className="gap-2 relative">
            <ShoppingCart className="h-4 w-4" />
            Cart
            {getCartItemCount() > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {getCartItemCount()}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fair-score">Fair Score (Best)</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="distance">Nearest First</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fair Algorithm Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">Fair Algorithm Pricing</h3>
              <p className="text-sm text-blue-700">Products are ranked based on fair pricing, quality, and local supplier support</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discount && (
                <Badge className="absolute top-2 left-2 bg-red-500">
                  -{product.discount}%
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className="absolute top-2 right-2 bg-white/90 backdrop-blur"
              >
                Fair Score: {product.fairScore}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-white/90 backdrop-blur"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.supplier}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {product.stock > 100 ? "In Stock" : "Low Stock"}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{product.location} • {product.distance} km</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{product.unit}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Delivery</p>
                    <p className="text-sm font-medium">{product.deliveryTime}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}