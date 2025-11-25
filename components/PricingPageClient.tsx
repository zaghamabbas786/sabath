'use client'

import { useUser, SignInButton, PricingTable } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function PricingPageClient() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-sabbath-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sabbath-espresso"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sabbath-cream flex flex-col">
      {/* Header */}
      <header className="w-full py-8 px-8 flex justify-between items-center">
        <button onClick={() => router.push('/')} className="flex items-center gap-3 group">
          <div className="bg-sabbath-gold/20 p-2 rounded-full group-hover:bg-sabbath-gold/40 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-sabbath-espresso">
              <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-sm font-sans font-bold tracking-widest uppercase text-sabbath-espresso group-hover:text-sabbath-clay transition-colors">
            SABBATH HEALTH
          </h1>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl mx-auto text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-sabbath-espresso mb-6">
            Choose Your Path to Healing
          </h1>
          <p className="font-sans text-xl text-sabbath-earth mb-8">
            Access Jesus-centered insights and personalized healing guidance
          </p>
        </div>

        {/* Sign-in prompt for unauthenticated users */}
        {!isSignedIn && (
          <div className="mb-8 p-6 bg-white rounded-2xl border border-sabbath-subtle shadow-sm">
            <p className="font-sans text-sabbath-espresso mb-4">
              Sign in to view and manage your subscription
            </p>
            <SignInButton mode="modal">
              <button className="px-8 py-3 rounded-full bg-sabbath-espresso text-white hover:bg-sabbath-clay transition-all duration-200 font-sans text-sm font-bold uppercase tracking-widest">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        )}

        {/* Clerk Pricing Table */}
        <div className="w-full max-w-5xl">
          <PricingTable 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-white rounded-3xl border-2 border-sabbath-subtle shadow-lg hover:shadow-xl transition-shadow',
                cardHeader: 'bg-sabbath-ivory rounded-t-3xl p-8',
                cardTitle: 'font-serif text-3xl text-sabbath-espresso',
                cardDescription: 'font-sans text-sabbath-earth mt-2',
                cardContent: 'p-8',
                cardFooter: 'p-8 pt-0',
                feature: 'font-sans text-sabbath-espresso py-2',
                featureIcon: 'text-sabbath-moss',
                pricingAmount: 'font-serif text-5xl text-sabbath-espresso',
                pricingCurrency: 'text-sabbath-warmGray',
                button: 'w-full py-4 rounded-full bg-sabbath-espresso text-white hover:bg-sabbath-clay transition-all duration-200 font-sans text-sm font-bold uppercase tracking-widest shadow-lg',
              },
            }}
          />
        </div>

        {/* Back to Home Link */}
        <div className="mt-12">
          <button
            onClick={() => router.push('/')}
            className="text-sabbath-warmGray hover:text-sabbath-espresso font-sans text-sm font-bold uppercase tracking-widest transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  )
}

