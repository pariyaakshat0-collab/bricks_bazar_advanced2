"use client"

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConstructionError, ConstructionLoading } from './construction-error'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: any
  isRetrying: boolean
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
    isRetrying: false
  })

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error)
      setState({
        hasError: true,
        error: event.error,
        errorInfo: { componentStack: event.error?.stack },
        isRetrying: false
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      setState({
        hasError: true,
        error: new Error('Network request failed'),
        errorInfo: { componentStack: '' },
        isRetrying: false
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const handleRetry = () => {
    setState({ ...state, isRetrying: true })
    setTimeout(() => {
      setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
      })
      window.location.reload()
    }, 1000)
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  if (state.hasError) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <ConstructionError 
        error={state.error || undefined}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
      />
    )
  }

  return <>{children}</>
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return <ConstructionLoading message={message} />
}

export function NetworkErrorHandler() {
  useEffect(() => {
    const handleNetworkError = (event: Event) => {
      const target = event.target as any
      if (target?.tagName === 'SCRIPT' && target?.src?.includes('_rsc=')) {
        console.warn('RSC request failed, retrying...')
        // Retry after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }

    document.addEventListener('error', handleNetworkError, true)
    return () => document.removeEventListener('error', handleNetworkError, true)
  }, [])

  return null
}