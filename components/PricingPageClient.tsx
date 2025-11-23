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

        {/* Clerk Pricing Table or Fallback */}
        <div className="w-full max-w-5xl">
          {/* Fallback pricing display - will be replaced by Clerk PricingTable once billing is enabled */}
          <div className="bg-white rounded-3xl border-2 border-sabbath-subtle shadow-lg p-12 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-sabbath-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="font-serif text-4xl text-sabbath-espresso mb-4">Sabbath Health Plus</h2>
            <div className="mb-6">
              <span className="font-serif text-6xl text-sabbath-espresso">$5</span>
              <span className="text-sabbath-warmGray text-xl">/month</span>
            </div>
            <p className="text-sabbath-earth font-sans text-lg mb-8">
              Full access to Jesus-centered healing insights
            </p>
            <ul className="text-left mb-10 space-y-3 max-w-md mx-auto">
              {[
                'Unlimited AI-powered healing insights',
                'Personalized prayer guidance',
                '7-day healing programs',
                'Emotional & spiritual analysis',
                'Scripture-based reflections'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-sabbath-moss shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sabbath-espresso font-sans">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="bg-sabbath-ivory border-2 border-sabbath-gold/30 rounded-2xl p-6 mb-6">
              <p className="text-sabbath-espresso font-sans font-bold mb-2">
                🔧 Clerk Billing Setup Required
              </p>
              <p className="text-sabbath-earth font-sans text-sm mb-4">
                To enable subscriptions, complete the setup in your Clerk Dashboard:
              </p>
              <ol className="text-left text-sabbath-earth font-sans text-sm space-y-2 mb-4">
                <li>1. Go to <strong>Configure → Billing</strong></li>
                <li>2. Click <strong>Enable Billing</strong></li>
                <li>3. Connect your Stripe account</li>
                <li>4. Create a subscription plan</li>
                <li>5. Create entitlement: <code className="bg-sabbath-subtle px-2 py-0.5 rounded">start_experience</code></li>
              </ol>
              <a 
                href="https://dashboard.clerk.com/last-active?path=billing/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-full bg-sabbath-espresso text-white hover:bg-sabbath-clay transition-all duration-200 font-sans text-sm font-bold uppercase tracking-widest"
              >
                Open Clerk Dashboard →
              </a>
            </div>

            <p className="text-sabbath-warmGray font-sans text-xs">
              See <strong>CLERK_BILLING_COMPLETE_SETUP.md</strong> for detailed instructions
            </p>
          </div>
          
          {/* This will work once Clerk Billing is enabled */}
          <div className="hidden">
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

