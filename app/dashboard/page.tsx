'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Wait for auth to load
    
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case 'buyer':
          router.replace('/dashboard/buyer')
          break
        case 'seller':
          router.replace('/dashboard/seller')
          break
        case 'distributor':
          router.replace('/dashboard/distributor')
          break
        case 'contractor':
          router.replace('/dashboard/contractor')
          break
        default:
          router.replace('/dashboard/buyer')
      }
    } else {
      // Redirect to auth if not logged in
      router.replace('/auth')
    }
  }, [user, loading, router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
}
