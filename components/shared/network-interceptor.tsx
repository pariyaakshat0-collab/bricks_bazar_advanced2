"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function NetworkInterceptor() {
  const router = useRouter()

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 3

    // Intercept fetch requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        
        // Check for RSC errors
        if (response.status === 404 && args[0]?.toString().includes('_rsc=')) {
          console.warn('RSC request failed, attempting retry...')
          
          if (retryCount < maxRetries) {
            retryCount++
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 500 * retryCount))
            return window.fetch(...args)
          }
        }
        
        return response
      } catch (error) {
        console.error('Network request failed:', error)
        
        if (retryCount < maxRetries) {
          retryCount++
          await new Promise(resolve => setTimeout(resolve, 500 * retryCount))
          return window.fetch(...args)
        }
        
        throw error
      }
    }

    // Handle navigation errors
    const handleNavigationError = (event: ErrorEvent) => {
      if (event.message?.includes('Failed to fetch') || event.message?.includes('NetworkError')) {
        console.warn('Navigation error detected, attempting recovery...')
        
        // Clear any cached data
        if (typeof window !== 'undefined') {
          sessionStorage.clear()
        }
        
        // Try to navigate to a safe page
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    }

    window.addEventListener('error', handleNavigationError)

    return () => {
      window.fetch = originalFetch
      window.removeEventListener('error', handleNavigationError)
    }
  }, [router])

  return null
}

// Custom hook for safe navigation
export function useSafeNavigation() {
  const router = useRouter()

  const safeNavigate = (path: string) => {
    try {
      // Clear any potential cached issues
      if (typeof window !== 'undefined') {
        const keys = Object.keys(sessionStorage)
        keys.forEach(key => {
          if (key.includes('_rsc') || key.includes('next')) {
            sessionStorage.removeItem(key)
          }
        })
      }
      
      router.push(path)
    } catch (error) {
      console.error('Navigation failed:', error)
      // Fallback to hard navigation
      window.location.href = path
    }
  }

  const safeReplace = (path: string) => {
    try {
      router.replace(path)
    } catch (error) {
      console.error('Navigation replace failed:', error)
      window.location.replace(path)
    }
  }

  return { safeNavigate, safeReplace }
}