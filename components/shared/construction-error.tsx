"use client"

import { useState, useEffect } from 'react'
import { HardHat, Wrench, Hammer, Construction, RefreshCw, Home, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ConstructionErrorProps {
  error?: Error
  onRetry?: () => void
  onGoHome?: () => void
}

export function ConstructionError({ error, onRetry, onGoHome }: ConstructionErrorProps) {
  const [progress, setProgress] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    // Simulate construction progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + 10
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
      onRetry?.()
    }, 2000)
  }

  const tools = [HardHat, Wrench, Hammer, Construction]
  const randomTool = tools[Math.floor(Math.random() * tools.length)]
  const ToolIcon = randomTool

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Construction site background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-600 rotate-45" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-orange-600 rounded-full" />
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-red-600 transform rotate-12" />
        <div className="absolute bottom-40 right-10 w-18 h-18 bg-yellow-700 rounded-lg" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-lg w-full shadow-2xl border-2 border-orange-200">
          <CardHeader className="text-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-t-lg">
            <div className="mx-auto mb-4 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <ToolIcon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-orange-800">
              🚧 Construction Zone Alert! 🚧
            </CardTitle>
            <CardDescription className="text-orange-600">
              Oops! Ye page abhi construction ke neeche hai
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Error Type:</strong> {error?.name || 'Page Construction Error'}
              </p>
              <p className="text-xs text-gray-500">
                {error?.message || 'Ye page temporarily unavailable hai due to technical construction'}
              </p>
            </div>

            {/* Construction Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Page Repair Progress:</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {isRetrying ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRetrying ? 'Repairing...' : 'Repair Page'}
              </Button>
              
              <Button 
                onClick={onGoHome || (() => window.location.href = '/')}
                variant="outline"
                className="border-orange-300 text-orange-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Safe Zone
              </Button>
              
              <Button 
                onClick={() => window.location.href = 'tel:+91-XXXXXXXXXX'}
                variant="outline"
                className="border-red-300 text-red-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Foreman
              </Button>
            </div>

            {/* Construction Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Construction className="w-4 h-4 mr-2" />
                Construction Safety Tips:
              </h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Page ko refresh karke try karein</li>
                <li>• Kuch der wait karein phir wapas aayein</li>
                <li>• Alternative pages ka use karein</li>
                <li>• Agar problem persist kare toh contact karein</li>
              </ul>
            </div>

            {/* Fun Construction Fact */}
            <div className="text-center">
              <p className="text-xs text-gray-500 italic">
                "Just like a real construction site, sometimes pages need maintenance too! 
                Hum jaldi hi isko wapas ready kar denge." 🏗️
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Special loading component with construction theme
export function ConstructionLoading({ message = "Building your experience..." }: { message?: string }) {
  const [dots, setDots] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev >= 3 ? 1 : prev + 1))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full shadow-xl border-2 border-yellow-300">
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-6 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
            <HardHat className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Under Construction
          </h3>
          <p className="text-orange-600 mb-4">
            {message}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </div>
          <p className="text-xs text-gray-500 mt-4">
            {".".repeat(dots).padEnd(3, " ")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}