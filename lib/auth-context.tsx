"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "buyer" | "seller" | "distributor" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  verified: boolean
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  loading: boolean
  refreshToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tokenRefreshTimeout, setTokenRefreshTimeout] = useState<NodeJS.Timeout | null>(null)

  // Token refresh functionality
  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'refresh',
        }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      localStorage.setItem('bricksbazar_token', data.accessToken)
      
      // Schedule next refresh
      setupTokenRefresh()
      
      return data.accessToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, logout the user
      await logout()
      return null
    }
  }

  // Setup automatic token refresh
  const setupTokenRefresh = () => {
    // Clear existing timeout
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout)
    }

    // Schedule refresh 5 minutes before token expiry (assuming 7 day expiry)
    const refreshTime = 7 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000 // 5 minutes before expiry
    
    const timeout = setTimeout(() => {
      refreshToken()
    }, refreshTime)
    
    setTokenRefreshTimeout(timeout)
  }

  useEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window === 'undefined') return;
    
    // Check for existing session
    const savedUser = localStorage.getItem("bricksbazar_user")
    const savedToken = localStorage.getItem("bricksbazar_token")
    
    if (savedUser && savedToken) {
      try {
        // Verify token is still valid
        setUser(JSON.parse(savedUser))
        setupTokenRefresh()
      } catch (error) {
        console.error('Failed to restore session:', error)
        localStorage.removeItem("bricksbazar_user")
        localStorage.removeItem("bricksbazar_token")
      }
    }
    setLoading(false)

    // Cleanup on unmount
    return () => {
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout)
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          action: 'login',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem('bricksbazar_user', JSON.stringify(data.user))
      localStorage.setItem('bricksbazar_token', data.accessToken)
      
      // Set default Authorization header for future requests
      if (typeof window !== 'undefined') {
        (window as any).fetch = new Proxy(window.fetch, {
          apply(target, thisArg, args) {
            const token = localStorage.getItem('bricksbazar_token')
            if (token && args[0] && typeof args[0] === 'string' && args[0].startsWith('/api/')) {
              args[1] = args[1] || {}
              args[1].headers = {
                ...args[1].headers,
                'Authorization': `Bearer ${token}`,
              }
            }
            return Reflect.apply(target, thisArg, args)
          }
        })
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          action: 'register',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        // Handle detailed validation errors
        if (error.details && Array.isArray(error.details)) {
          throw new Error(error.details.join('. '))
        }
        throw new Error(error.error || 'Registration failed')
      }

      const data = await response.json()
      setUser(data.user)
      localStorage.setItem('bricksbazar_user', JSON.stringify(data.user))
      localStorage.setItem('bricksbazar_token', data.accessToken)
      
      // Set up automatic token refresh
      setupTokenRefresh()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call logout API to invalidate tokens
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bricksbazar_token')}`,
        },
      })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('bricksbazar_user')
      localStorage.removeItem('bricksbazar_token')
      
      // Clear any scheduled token refresh
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout)
      }
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading, refreshToken }}>{children}</AuthContext.Provider>
}
