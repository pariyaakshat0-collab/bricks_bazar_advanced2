"use client"

import type React from "react"

import { AuthProvider } from "@/lib/auth-context"
import { NotificationProvider } from "@/components/shared/notification-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  )
}
