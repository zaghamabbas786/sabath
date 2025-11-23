import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const authResult = await auth()
    const userId = authResult.userId
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has the required entitlement
    // Clerk Billing automatically manages entitlements based on subscription status
    const hasEntitlement = authResult.has ? 
      await authResult.has({ permission: 'start_experience' }) : 
      false
    
    return NextResponse.json({ 
      hasActiveSubscription: hasEntitlement,
      userId,
      entitlement: hasEntitlement ? 'start_experience' : 'none'
    })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

