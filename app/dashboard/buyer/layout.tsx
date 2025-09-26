"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { LiveChat } from "@/components/shared/live-chat"

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
    if (user && user.role !== "buyer") {
      router.push(`/dashboard/${user.role}`)
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "buyer") {
    return null
  }

  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-auto p-6">{children}</main>
      <LiveChat />
    </div>
  )
}
