import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'

export async function GET() {
  try {
    // Check database connection
    await dbConnect()
    
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'operational'
      },
      uptime: process.uptime()
    }
    
    return NextResponse.json(healthCheck)
  } catch (error) {
    console.error('Health check failed:', error)
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'error',
        api: 'operational'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    }
    
    return NextResponse.json(errorResponse, { status: 503 })
  }
}