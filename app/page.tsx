"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Calculator, MapPin, Shield, Truck, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  // Show loading while redirecting
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">BricksBazar</h1>
              <p className="text-xs text-muted-foreground">Digital Marketplace for Construction</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            )}
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-balance">
          Transforming Construction Supply Chains into <span className="text-primary">Smart Digital Platforms</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
          Connect buyers, sellers, and distributors in a fair, transparent marketplace that supports both local
          retailers and big distributors.
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 bg-transparent"
              onClick={logout}
            >
              Logout & Visit Homepage
            </Button>
          ) : (
            <>
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8">
                  Start Building
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Smart Digital Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Calculator className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Smart Cost Estimator</CardTitle>
              <CardDescription>Get instant material cost estimates for your construction projects</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Location-based Pricing</CardTitle>
              <CardDescription>Compare prices from local and regional suppliers in real-time</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Verified Suppliers</CardTitle>
              <CardDescription>Work with trusted, verified sellers and distributors</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Real-time Tracking</CardTitle>
              <CardDescription>Track your deliveries from order to doorstep</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Fair Marketplace</CardTitle>
              <CardDescription>Balanced platform supporting both local retailers and distributors</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Construction Planning</CardTitle>
              <CardDescription>AI-powered material suggestions for your projects</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Problem Solution Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Solving Real Construction Challenges</h2>
            <p className="text-lg text-muted-foreground mb-12 text-pretty">
              Our platform addresses the imbalance between big distributors and local retailers through innovative
              algorithms and fair marketplace practices.
            </p>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">The Problem</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Buyers prefer big distributors for lower prices</li>
                    <li>• Local sellers struggle to compete</li>
                    <li>• Lack of transparency in pricing</li>
                    <li>• Complex supply chain management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Our Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Fair visibility algorithm</li>
                    <li>• Local-first policy with proximity highlighting</li>
                    <li>• Dynamic commission structure</li>
                    <li>• Trust badges for verified local sellers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold">BricksBazar</span>
          </div>
          <p className="text-muted-foreground">© 2024 BricksBazar. Transforming construction supply chains.</p>
        </div>
      </footer>
    </div>
  )
}
