import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Redirect to the pricing page which contains the PricingTable
    // Clerk's PricingTable component handles the checkout flow
    const pricingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`
    
    return NextResponse.json({ 
      url: pricingUrl,
      message: 'Redirect to pricing page'
    })
  } catch (error) {
    console.error('Error creating checkout:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

