import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/forms/login-form'

export const metadata: Metadata = {
  title: 'Login - PorterGoldberg MVP',
  description: 'Sign in to your PorterGoldberg account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-foreground-secondary">
            Sign in to your PorterGoldberg account
          </p>
        </div>

        <LoginForm />

        <div className="text-center">
          <p className="text-sm text-foreground-secondary">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}