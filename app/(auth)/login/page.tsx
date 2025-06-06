import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/forms/login-form'

export const metadata: Metadata = {
  title: 'Login - PorterGoldberg MVP',
  description: 'Sign in to your PorterGoldberg account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">
            PorterGoldberg
          </h2>
          <p className="text-sm text-accent-secondary uppercase tracking-wider">
            Real Estate Platform
          </p>
        </div>

        {/* Welcome message */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">
            Welcome back
          </h1>
          <p className="mt-2 text-lg text-neutral-medium">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium/10 p-8">
          <LoginForm />
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-neutral-medium">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}