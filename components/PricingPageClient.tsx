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
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto text-center mb-8 md:mb-12">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-sabbath-espresso mb-4 md:mb-6 leading-tight">
            Choose Your Path to Healing
          </h1>
          <p className="font-sans text-lg md:text-xl text-sabbath-earth mb-6 md:mb-8">
            Access Jesus-centered insights and personalized healing guidance
          </p>
        </div>

        {/* Marketing Copy */}
        <div className="w-full max-w-3xl mx-auto mb-8 md:mb-12 px-4">
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 lg:p-12 border border-sabbath-subtle/60 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sabbath-gold/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <p className="font-serif text-xl md:text-2xl lg:text-3xl text-sabbath-espresso mb-5 md:mb-6 leading-relaxed relative z-10">
              Begin your Scripture Rooted Healing for less than the price of a cup of coffee.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-5 md:mb-6 relative z-10">
              <p className="font-sans text-base md:text-lg lg:text-xl text-sabbath-earth font-semibold">
                A full year for <span className="text-sabbath-moss font-bold text-lg md:text-xl">$1.20</span>
              </p>
              <span className="hidden md:inline text-sabbath-warmGray text-xl">•</span>
              <p className="font-sans text-base md:text-lg lg:text-xl text-sabbath-earth font-semibold">
                or <span className="text-sabbath-moss font-bold text-lg md:text-xl">$2/month</span>
              </p>
            </div>
            
            <p className="font-sans text-sm md:text-base lg:text-lg text-sabbath-warmGray leading-relaxed italic relative z-10">
              A quiet space to listen, reflect, and let Him meet you where you are.
            </p>
          </div>
        </div>

        {/* Sign-in prompt for unauthenticated users */}
        {!isSignedIn && (
          <div className="mb-6 md:mb-8 w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-2xl border border-sabbath-subtle shadow-sm p-6">
              <p className="font-sans text-sabbath-espresso mb-4 text-center">
                Sign in to view and manage your subscription
              </p>
              <SignInButton mode="modal">
                <button className="w-full px-8 py-3 rounded-full bg-sabbath-espresso text-white hover:bg-sabbath-clay transition-all duration-200 font-sans text-sm font-bold uppercase tracking-widest shadow-md hover:shadow-lg">
                  Sign In to Continue
                </button>
              </SignInButton>
            </div>
          </div>
        )}

        {/* Clerk Pricing Table */}
        <div className="w-full max-w-5xl px-4">
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
        <div className="mt-8 md:mt-12">
          <button
            onClick={() => router.push('/')}
            className="text-sabbath-warmGray hover:text-sabbath-espresso font-sans text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>Back to Home</span>
          </button>
        </div>
      </main>
    </div>
  )
}

