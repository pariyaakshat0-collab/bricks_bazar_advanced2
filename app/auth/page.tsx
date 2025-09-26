"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/lib/auth-context"
import { Building2 } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12 text-primary-foreground">
        <div className="flex flex-col justify-center max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold">BricksBazar</h1>
              <p className="text-primary-foreground/80 text-sm">Digital Marketplace for Construction</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-balance">Transforming Construction Supply Chains</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 text-pretty">
            Connect with verified suppliers, get instant cost estimates, and manage your construction projects with
            smart digital tools.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Smart Cost Estimation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Verified Supplier Network</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Real-time Delivery Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">BricksBazar</span>
            </div>
            <p className="text-muted-foreground">Digital Marketplace for Construction</p>
          </div>

          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
