import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-sabbath-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-sabbath-espresso mb-3">Welcome Back</h1>
          <p className="font-sans text-sabbath-warmGray">Sign in to continue your healing journey</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-white shadow-lg rounded-3xl border border-sabbath-subtle',
            }
          }}
        />
      </div>
    </div>
  )
}

