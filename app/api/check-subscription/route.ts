import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== CHECK SUBSCRIPTION API CALLED ===')
    const authResult = await auth()
    const userId = authResult.userId
    
    console.log('1. User ID:', userId)
    console.log('2. Auth result has() function exists:', !!authResult.has)
    
    if (!userId) {
      console.log('❌ No user ID - Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has the required feature
    // Clerk Billing automatically manages features based on subscription status
    console.log('3. Checking for feature: start_experience')
    
    const hasFeature = authResult.has ? 
      await authResult.has({ feature: 'start_experience' }) : 
      false
    
    console.log('4. Has feature result:', hasFeature)
    console.log('5. Returning response:', { 
      hasActiveSubscription: hasFeature,
      userId,
      feature: hasFeature ? 'start_experience' : 'none'
    })
    
    return NextResponse.json({ 
      hasActiveSubscription: hasFeature,
      userId,
      feature: hasFeature ? 'start_experience' : 'none',
      debug: {
        hasFunction: !!authResult.has,
        checkedFeature: 'start_experience'
      }
    })
  } catch (error) {
    console.error('❌ Error checking subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

