'use client'

import dynamic from 'next/dynamic'

const PricingPageClient = dynamic(() => import('@/components/PricingPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-sabbath-cream flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sabbath-espresso"></div>
    </div>
  ),
})

export default function PricingPage() {
  return <PricingPageClient />
}

