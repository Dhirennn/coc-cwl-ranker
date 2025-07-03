import { NextResponse } from 'next/server'
import { initializePing } from '@/lib/ping-utils'

// Track if ping has been initialized to avoid duplicate intervals
let isPingInitialized = false

export async function GET() {
  try {
    if (!isPingInitialized) {
      initializePing()
      isPingInitialized = true
      
      return NextResponse.json({
        status: 'success',
        message: 'Ping mechanism initialized successfully',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        status: 'already_initialized',
        message: 'Ping mechanism was already initialized',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Failed to initialize ping:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to initialize ping mechanism',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 