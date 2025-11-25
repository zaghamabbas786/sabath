# Sabbath Health - Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features & Functionality](#features--functionality)
4. [Architecture](#architecture)
5. [Authentication & Authorization](#authentication--authorization)
6. [Subscription & Billing](#subscription--billing)
7. [AI Integration](#ai-integration)
8. [API Routes](#api-routes)
9. [Components Structure](#components-structure)
10. [Security Implementation](#security-implementation)
11. [Environment Variables](#environment-variables)
12. [Deployment](#deployment)

---

## 📖 Project Overview

**Sabbath Health** is a Christian-centered healing and wellness application that helps users understand the emotional and spiritual roots of their physical symptoms. The application integrates AI-powered insights based on teachings from Charles Wright and Louise Hay, filtered through a Biblical lens.

### Purpose
- Connect physical symptoms to emotional and spiritual patterns
- Provide scripture-based guidance and prayers
- Offer 7-day healing programs
- Create a safe space for spiritual healing exploration

### Target Users
- Christians seeking holistic healing approaches
- Individuals exploring mind-body-spirit connections
- People wanting faith-based health guidance

---

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 15.1.4** (App Router)
  - Server-Side Rendering (SSR)
  - Client-Side Rendering (CSR)
  - API Routes
  - File-based routing
  - React Server Components

### Core Libraries
- **React 19.2.0**
  - Hooks (useState, useEffect, useUser, useAuth)
  - Component-based architecture
  - Client/Server component separation

### Authentication & Billing
- **Clerk 6.15.0** (`@clerk/nextjs`)
  - User authentication and management
  - Session handling
  - Social login support
  - Built-in billing system
  - Entitlement/feature management
  - Subscription tracking
  - Middleware-based route protection

### AI/ML Integration
- **Google Gemini AI** (`@google/genai 1.30.0`)
  - Model: `gemini-2.0-flash`
  - Structured JSON output
  - System instructions
  - Response schema validation
  - Backend API integration (secure)

### Styling
- **Tailwind CSS 3.4.1**
  - Utility-first CSS framework
  - Custom color palette
  - Responsive design
  - Dark/light mode support

### Build Tools
- **PostCSS 8.4.49** - CSS processing
- **Autoprefixer 10.4.20** - Browser compatibility
- **TypeScript 5.8.2** - Type safety

### Development Tools
- **ESLint 9** - Code linting
- **eslint-config-next** - Next.js specific rules

---

## ✨ Features & Functionality

### 1. **User Authentication**
- Sign up with email/social providers
- Secure sign-in with Clerk
- Session management
- Single Sign-On (SSO) ready
- User profile management

### 2. **Subscription Management**
- Clerk-powered billing integration
- Stripe payment processing (managed by Clerk)
- Feature-based access control
- Subscription status checking
- Pricing table display
- Automatic entitlement management

### 3. **AI-Powered Healing Insights**
Users can search for physical symptoms and receive:

#### a. **Empathetic Understanding**
- Compassionate reflection of the user's concern
- Non-diagnostic, supportive language

#### b. **Body-Mind Connections**
- Physical/metaphorical connections to symptoms
- Based on Louise Hay's teachings (Christian filter)

#### c. **Emotional Roots Analysis**
- 2-4 paragraph deep dive into emotional patterns
- Explores stress, fear, resentment, guilt, grief
- How emotions affect behavior and relationships
- How Christ heals these patterns

#### d. **Spiritual Roots Insights**
- 5-7 poetic stanzas on spiritual themes
- Internal agreements and spiritual weight
- Jesus-centered healing approach
- Holy Spirit's role in restoration

#### e. **Scripture Anchors**
- 2-4 relevant Bible verses
- Short paraphrases for easy understanding
- Context for healing and hope

#### f. **Guided Prayer**
- 6-8 stanza structured prayer
- Takes user into God's presence
- Addresses specific burdens
- Speaks truth over lies
- Seals healing in Christ

#### g. **7-Day Healing Program**
Daily activities including:
- Day 1: Notice & Name
- Day 2: Release Fear
- Day 3: Receive Truth
- Day 4: Bless Your Body
- Day 5: Release Resentment
- Day 6: Practice Gratitude
- Day 7: Stillness & Listening

Each day includes:
- Reflective activity
- Listening-to-Jesus prompt
- Scripture reference
- Declaration of truth

#### h. **Medical Warning System**
- Flags symptoms requiring immediate medical attention
- Alerts for emergencies (chest pain, stroke, etc.)
- Encourages professional medical care when needed

### 4. **User Flow Management**

#### Unauthenticated Users:
- Can view home page
- Can browse symptom categories
- Cannot perform searches
- Redirected to sign-in when attempting search

#### Authenticated Users (No Subscription):
- Can sign in successfully
- Redirected to pricing page on search attempt
- Query saved for post-subscription execution

#### Subscribed Users:
- Full access to AI-powered healing insights
- Unlimited searches
- Complete healing response display
- 7-day program access

### 5. **UI/UX Features**
- Responsive design (mobile, tablet, desktop)
- Loading states with animations
- Error handling and display
- Beautiful card-based layout
- Smooth transitions
- User-friendly navigation

### 6. **State Management**
Application uses multiple state flows:
- `HOME` - Landing page
- `SEARCHING` - AI processing query
- `RESULTS` - Displaying healing insights
- `ERROR` - Error handling
- `PAYWALL` - Subscription required

---

## 🏗 Architecture

### Application Structure

```
sabbath-health/
├── app/                        # Next.js App Router
│   ├── api/                    # Backend API routes
│   │   ├── check-subscription/ # Verify user subscription
│   │   ├── create-checkout/    # Handle billing redirect
│   │   └── generate-healing/   # Gemini AI integration (secure)
│   ├── pricing/                # Pricing page (Clerk PricingTable)
│   ├── sign-in/                # Clerk sign-in page
│   ├── sign-up/                # Clerk sign-up page
│   ├── layout.tsx              # Root layout with ClerkProvider
│   ├── page.tsx                # Home page entry point
│   └── globals.css             # Tailwind styles
├── components/                 # React components
│   ├── SabbathHealthApp.tsx    # Main app logic and UI
│   └── PricingPageClient.tsx   # Client-side pricing component
├── lib/                        # Utilities and types
│   ├── constants.ts            # Symptom categories
│   └── types.ts                # TypeScript interfaces
├── middleware.ts               # Clerk route protection
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies
```

### Data Flow

```
User Input (Search Query)
        ↓
Frontend (SabbathHealthApp.tsx)
        ↓
Authentication Check (Clerk useUser)
        ↓
Subscription Check (API: /api/check-subscription)
        ↓
Backend API Call (/api/generate-healing)
        ↓
Gemini AI Processing (gemini-2.0-flash)
        ↓
Structured JSON Response
        ↓
Frontend Display (ResultView)
        ↓
User sees Healing Insights
```

---

## 🔐 Authentication & Authorization

### Clerk Integration

#### 1. **ClerkProvider** (`app/layout.tsx`)
Wraps entire application for authentication context

#### 2. **Middleware** (`middleware.ts`)
```typescript
- Protects all routes by default
- Public routes: /, /sign-in, /sign-up, /pricing
- Automatic redirect to sign-in for protected routes
```

#### 3. **Client-Side Hooks**
```typescript
useUser()  // Get current user, check isSignedIn
useAuth()  // Get authentication state
```

#### 4. **Server-Side Functions**
```typescript
auth()  // Get user ID and auth state in API routes
auth().has({ feature: 'start_experience' })  // Check entitlements
```

#### 5. **UI Components**
- `<SignIn />` - Pre-built sign-in form
- `<SignUp />` - Pre-built sign-up form
- `<UserButton />` - User profile dropdown
- `<SignInButton />` - Trigger sign-in flow

---

## 💳 Subscription & Billing

### Clerk Billing System

#### Feature-Based Access Control
```typescript
// Check if user has required feature
const hasFeature = await auth().has({ 
  feature: 'start_experience' 
})
```

#### Subscription Flow

1. **User attempts search without subscription**
   - Query saved to state
   - Redirected to `/pricing`

2. **User views pricing page**
   - Clerk `PricingTable` component displayed
   - Shows available plans
   - Handles Stripe checkout (managed by Clerk)

3. **User subscribes**
   - Clerk processes payment via Stripe
   - Feature automatically added to user account
   - User redirected back to app

4. **User tries search again**
   - Subscription check passes
   - Pending query executed
   - Results displayed

#### Entitlement Management
- Managed entirely by Clerk
- No manual metadata updates needed
- Automatic feature granting/revoking
- Webhook handling by Clerk

#### API Endpoints

**`/api/check-subscription`**
```typescript
GET request
Returns: { hasActiveSubscription: boolean, userId: string }
Checks: auth().has({ feature: 'start_experience' })
```

**`/api/create-checkout`**
```typescript
POST request
Returns: { url: '/pricing' }
Purpose: Redirect to pricing page
```

---

## 🤖 AI Integration

### Google Gemini Configuration

#### Model
- **Name**: `gemini-2.0-flash`
- **Purpose**: Fast, structured JSON responses
- **Provider**: Google AI

#### System Instruction
Comprehensive prompt defining:
- Tone: Compassionate, Christ-centered, monastic
- Content rules: Biblical focus, no New Age language
- Structure: JSON response format
- Guidelines: Depth, empathy, no diagnosis

#### Response Schema
Structured TypeScript interface ensuring:
```typescript
{
  what_i_am_hearing: string
  body_connection: string[]
  emotional_roots: string[]
  spiritual_roots: string[]
  scripture_anchors: { reference: string, text: string }[]
  guided_prayer: string[]
  seven_day_program: DayProgram[]
  is_medical_warning: boolean
}
```

#### Security Implementation
- ❌ **NOT** called from frontend (secure)
- ✅ Called from backend API route (`/api/generate-healing`)
- ✅ API key stored server-side only
- ✅ Authentication verified before API call
- ✅ Subscription verified before processing

#### API Flow
```typescript
1. Frontend sends query to /api/generate-healing
2. Backend verifies authentication (Clerk)
3. Backend verifies subscription (Clerk Billing)
4. Backend calls Gemini API with secure key
5. Backend returns healing insights
6. Frontend displays results
```

---

## 🛣 API Routes

### 1. **`/api/check-subscription`**
**Method**: GET  
**Purpose**: Check if user has active subscription  
**Authentication**: Required (Clerk)  
**Response**:
```json
{
  "hasActiveSubscription": true/false,
  "userId": "user_xxxxx",
  "feature": "start_experience" or "none"
}
```

### 2. **`/api/create-checkout`**
**Method**: POST  
**Purpose**: Redirect to pricing page  
**Authentication**: Required (Clerk)  
**Response**:
```json
{
  "url": "/pricing",
  "message": "Redirect to pricing page"
}
```

### 3. **`/api/generate-healing`**
**Method**: POST  
**Purpose**: Generate AI healing insights  
**Authentication**: Required (Clerk)  
**Subscription**: Required  
**Request Body**:
```json
{
  "query": "user's symptom description"
}
```
**Response**:
```json
{
  "success": true,
  "data": { /* HealingResponse object */ }
}
```

---

## 🧩 Components Structure

### 1. **SabbathHealthApp.tsx** (Main Component)
**Type**: Client Component (`'use client'`)  
**Responsibilities**:
- State management (search, results, user, subscription)
- User authentication checks
- Subscription verification
- Search functionality
- UI rendering (Home, Search, Results, Paywall, Error)
- API communication

**Key Functions**:
- `checkSubscriptionStatus()` - Verify user subscription
- `handleSearchTrigger(query)` - Process search with auth/subscription checks
- `performSearch(query)` - Call backend API for healing insights
- `handlePaymentClick()` - Redirect to pricing

**Sub-Components**:
- `Header` - Navigation and user menu
- `WelcomeView` - Landing page with symptom categories
- `ResultView` - Display healing insights
- `PaywallView` - Subscription required message
- `ErrorView` - Error handling display

### 2. **PricingPageClient.tsx**
**Type**: Client Component (`'use client'`)  
**Purpose**: Display Clerk's pricing table  
**Features**:
- Shows subscription plans
- Handles Clerk Billing UI
- Conditional rendering based on auth state
- Loading states

### 3. **Layout.tsx** (Root Layout)
**Type**: Server Component  
**Purpose**: Application-wide setup  
**Features**:
- ClerkProvider wrapper
- Global CSS import
- HTML metadata

---

## 🔒 Security Implementation

### 1. **API Key Protection**
- ❌ Gemini API key NOT exposed to browser
- ✅ Key stored as `GEMINI_API_KEY` (no `NEXT_PUBLIC_` prefix)
- ✅ Only accessible in server-side code
- ✅ API calls made from backend routes only

### 2. **Route Protection**
```typescript
// middleware.ts
- All routes protected by default
- Public: /, /sign-in, /sign-up, /pricing
- Private: Everything else requires authentication
```

### 3. **API Route Security**
All API routes verify:
1. Authentication (user logged in)
2. Authorization (subscription active for protected features)

### 4. **Environment Variables**
**Public** (exposed to browser):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  # Safe by design
```

**Private** (server-only):
```env
CLERK_SECRET_KEY          # Authentication
GEMINI_API_KEY            # AI service
```

### 5. **Data Validation**
- Request body validation in API routes
- Response schema enforcement from Gemini
- Safe navigation in UI to handle undefined data

### 6. **PCI Compliance**
- No direct payment handling in code
- All payments processed by Clerk/Stripe
- No sensitive payment data stored

---

## 🌍 Environment Variables

### Required Variables

#### Development (`.env.local`)
```env
# Clerk Authentication (Public)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Clerk Secret (Private)
CLERK_SECRET_KEY=sk_test_xxxxx

# App URL (Public)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Gemini AI (Private - Server-side only)
GEMINI_API_KEY=xxxxx
```

#### Production (Vercel)
```env
# Same as above but with production keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
GEMINI_API_KEY=xxxxx
```

### Variable Types

| Variable | Prefix | Accessible From | Purpose |
|----------|--------|-----------------|---------|
| `NEXT_PUBLIC_*` | Yes | Frontend + Backend | Safe to expose |
| No prefix | No | Backend only | Secure/sensitive |

---

## 🚀 Deployment

### Vercel (Recommended)

#### Prerequisites
1. GitHub repository
2. Vercel account
3. Environment variables ready
4. Clerk Billing configured

#### Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Connect to `main` branch

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
     - `GEMINI_API_KEY`
     - `NEXT_PUBLIC_APP_URL` (your Vercel domain)

4. **Deploy**
   - Vercel auto-deploys on push to `main`
   - First deployment triggered automatically
   - View logs for any errors

5. **Post-Deployment**
   - Update Clerk Dashboard with production URL
   - Test authentication flow
   - Test subscription flow
   - Verify AI search functionality

### Build Configuration
```json
{
  "scripts": {
    "dev": "next dev",           // Local development
    "build": "next build",       // Production build
    "start": "next start",       // Production server
    "lint": "next lint"          // Code linting
  }
}
```

---

## 📊 Key Statistics

- **Lines of Code**: ~1500+
- **Components**: 8 (including sub-components)
- **API Routes**: 3
- **Type Definitions**: 5 interfaces
- **Dependencies**: 16 packages
- **Supported Features**: 10+

---

## 🎯 Business Logic Summary

### User Journey

```
1. User lands on home page → Unauthenticated
   ↓
2. User enters symptom search
   ↓
3. System checks authentication → NOT signed in
   ↓
4. Redirect to /sign-in
   ↓
5. User signs up/signs in → Authenticated
   ↓
6. System checks subscription → NO active subscription
   ↓
7. Redirect to /pricing
   ↓
8. User subscribes via Clerk Billing
   ↓
9. System grants feature: 'start_experience'
   ↓
10. System executes pending search
    ↓
11. Backend calls Gemini AI
    ↓
12. Results displayed to user
    ↓
13. User can now search unlimited times
```

---

## 🔄 State Management

### Application States
```typescript
enum AppState {
  HOME,      // Landing page
  SEARCHING, // Loading AI response
  RESULTS,   // Displaying insights
  ERROR      // Error occurred
}
```

### User States
```typescript
- isSignedIn: boolean           // Clerk authentication
- hasActiveSubscription: boolean // Clerk entitlement
- checkingSubscription: boolean  // Loading state
- pendingQuery: string          // Saved search query
```

---

## 📝 Type Definitions

### Main Interfaces

```typescript
interface HealingResponse {
  what_i_am_hearing: string
  body_connection: string[]
  emotional_roots: string[]
  spiritual_roots: string[]
  scripture_anchors: ScriptureReference[]
  guided_prayer: string[]
  seven_day_program: DayProgram[]
  is_medical_warning: boolean
}

interface ScriptureReference {
  reference: string
  text: string
}

interface DayProgram {
  day_title: string
  activity: string
  listening_prompt: string
  scripture_ref: string
  declaration: string
}

interface SymptomCategory {
  title: string
  description: string
  examples: string[]
  color: string
}
```

---

## 🎨 Design System

### Color Palette
```css
--color-moss: #586F4E (Primary)
--color-sage: #A3B18A (Secondary)
--color-sand: #F2E8CF (Background)
--color-earth: #BC6C25 (Accent)
--color-clay: #936639 (Tertiary)
```

### Typography
- **Font**: System fonts (optimized for performance)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, comfortable spacing

### Layout Principles
- **Mobile-first**: Responsive breakpoints
- **Card-based**: Content organization
- **Whitespace**: Breathing room for content
- **Accessibility**: WCAG compliant

---

## 🧪 Testing Recommendations

### Manual Testing Checklist
- [ ] Sign up flow
- [ ] Sign in flow
- [ ] Search without authentication → redirects to sign-in
- [ ] Search without subscription → redirects to pricing
- [ ] Subscribe to plan
- [ ] Search with subscription → displays results
- [ ] Medical warning flag displays correctly
- [ ] 7-day program displays completely
- [ ] Responsive design on mobile/tablet
- [ ] Error handling for failed API calls

---

## 📚 Additional Resources

### Clerk Documentation
- [Clerk Next.js Setup](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Billing](https://clerk.com/docs/billing/overview)

### Gemini AI Documentation
- [Gemini API Guide](https://ai.google.dev/docs)
- [Structured Output](https://ai.google.dev/docs/structured_output)

### Next.js Documentation
- [App Router](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 🎓 Learning Outcomes

This project demonstrates:
✅ Full-stack Next.js development  
✅ Modern authentication patterns  
✅ Subscription-based business model  
✅ AI/ML integration (Gemini)  
✅ Secure API key management  
✅ Payment processing (Stripe via Clerk)  
✅ TypeScript type safety  
✅ Responsive UI design  
✅ Server/Client component architecture  
✅ Route protection and middleware  
✅ Environment variable management  
✅ Production deployment (Vercel)  

---

## 📞 +923475366382(zaghama96@gmail.com) Support & Maintenance

### Common Issues

1. **Hydration Error on Pricing Page**
   - Fixed with `dynamic` import and `ssr: false`

2. **API Key Not Found**
   - Ensure `GEMINI_API_KEY` (not `NEXT_PUBLIC_`) is set
   - Restart dev server after env changes

3. **Subscription Not Detected**
   - Check Clerk Dashboard for billing setup
   - Verify feature name matches code

4. **Localhost Redirect on Vercel**
   - Remove `NEXT_PUBLIC_APP_URL` or set to production URL
   - Redeploy application

---

## 🏆 Project Achievements

✅ **Secure by Design**: No API keys exposed to frontend  
✅ **User-Friendly**: Intuitive flow from landing to results  
✅ **Scalable**: Ready for multiple apps with same auth  
✅ **Maintainable**: Clean code structure and documentation  
✅ **Modern Stack**: Latest versions of all dependencies  
✅ **Production-Ready**: Deployed on Vercel with proper config  

---

**Last Updated**: November 25, 2025  
**Version**: 1.0.0  
**Author**: Sabbath Health Development Team

