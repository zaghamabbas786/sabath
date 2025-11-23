# Sabbath Health

A Jesus-centered healing application that helps users understand emotional and spiritual roots of physical symptoms through prayer, scripture, and reflection.

## Features

- **Clerk Authentication**: Secure user authentication and session management
- **Clerk Billing**: Simple subscription management (Clerk handles Stripe for you!)
- **Public Landing Page**: Unauthenticated users can explore the interface
- **AI-Powered Insights**: Uses Google Gemini AI to provide compassionate, scripture-based healing guidance
- **Emotional & Spiritual Analysis**: Connects physical symptoms to emotional and spiritual roots
- **Prayer Guidance**: Personalized prayer journeys
- **7-Day Healing Program**: Structured daily reflections and activities
- **Beautiful UI**: Modern, calming interface with custom Tailwind theme

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Billing**: Clerk Billing (powered by Stripe, but managed by Clerk)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini AI (@google/genai)
- **Fonts**: Cormorant Garamond (serif), Quicksand (sans-serif)

## Prerequisites

- Node.js 18+ 
- A Clerk account ([clerk.com](https://clerk.com))
- A Google Gemini API key ([ai.google.dev](https://ai.google.dev))
- (Optional) Clerk Billing enabled for production subscriptions

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd sabbath-health
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your keys:

```env
# Clerk (get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Gemini AI (get from ai.google.dev)
NEXT_PUBLIC_GEMINI_API_KEY=xxxxx
```

**No Stripe keys needed!** Clerk handles billing for you.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Detailed Setup Guides

- **[CLERK_BILLING_SETUP.md](./CLERK_BILLING_SETUP.md)** - Complete Clerk Billing setup guide
- **[.env.example](./.env.example)** - All required environment variables

## User Flow

1. **Unauthenticated users** can:
   - View the home page
   - Explore symptom categories
   - See the interface
   - View the `/pricing` page

2. **When trying to search**:
   - Not signed in → Redirected to sign-in/sign-up
   - Signed in but no subscription → Redirected to `/pricing`

3. **On Pricing Page** (`/pricing`):
   - View plans in Clerk's PricingTable component
   - Subscribe via Stripe (managed by Clerk)
   - Automatically receive `start_experience` entitlement

4. **Subscribed users**:
   - Full access to AI-powered insights
   - Unlimited searches
   - Complete healing programs
   - Access verified via entitlements system

## API Routes

- `POST /api/create-checkout` - Redirect to Clerk billing portal
- `GET /api/check-subscription` - Check user subscription status from Clerk metadata
- `GET /api/auth-required` - Check authentication status

**Note**: No webhook handling needed - Clerk manages this automatically!

## Testing

### Method 1: Enable Clerk Billing (Recommended)

1. Follow [CLERK_BILLING_COMPLETE_SETUP.md](./CLERK_BILLING_COMPLETE_SETUP.md)
2. Enable billing in Clerk Dashboard
3. Create subscription plan
4. Create `start_experience` entitlement
5. Attach entitlement to plan
6. Test full subscription flow

### Method 2: Manual Entitlement Grant (Testing Only)

1. Sign up for an account
2. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Users
3. Select your user → **Entitlements** tab
4. Manually grant `start_experience` entitlement
5. Refresh your app → Search now works!

Note: Method 2 requires billing to be enabled in Clerk first.

## Project Structure

```
sabbath-health/
├── app/
│   ├── api/
│   │   ├── check-subscription/    # Check Clerk metadata
│   │   └── create-checkout/       # Redirect to billing
│   ├── sign-in/                   # Auth pages
│   ├── sign-up/
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/
│   └── SabbathHealthApp.tsx       # Main app component
├── lib/
│   ├── constants.ts               # Symptom categories
│   └── types.ts                   # TypeScript types
└── middleware.ts                  # Clerk protection
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Set up production Stripe webhook
5. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_GEMINI_API_KEY=xxxxx
```

Configure billing in Clerk Dashboard instead of managing Stripe keys!

## Security

- ✅ All routes protected by Clerk middleware (except public pages)
- ✅ API routes verify authentication server-side
- ✅ Clerk handles all billing securely
- ✅ Subscription status in Clerk metadata
- ✅ No sensitive payment data in your code
- ✅ PCI compliance handled by Clerk/Stripe

## Support

For issues or questions:
1. Check [CLERK_BILLING_SETUP.md](./CLERK_BILLING_SETUP.md)
2. Review Clerk Dashboard for subscription status
3. Check Clerk Dashboard for auth issues
4. Review server logs for API errors

## License

Private - All rights reserved

## Disclaimer

This application offers spiritual insights and prayerful reflection. It is **not** a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
