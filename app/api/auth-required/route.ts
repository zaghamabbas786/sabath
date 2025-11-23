import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// This route can be called to check if user is authenticated
// Useful for client-side checks before making other API calls
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true, userId })
  } catch (error) {
    console.error('Error checking auth:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


