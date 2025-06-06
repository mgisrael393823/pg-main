import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/forms/register-form'

export const metadata: Metadata = {
  title: 'Register - PorterGoldberg MVP',
  description: 'Create your PorterGoldberg account',
}

export default function RegisterPage() {
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
            Get started today
          </h1>
          <p className="mt-2 text-lg text-neutral-medium">
            Create your account in less than a minute
          </p>
        </div>

        {/* Register form */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium/10 p-8">
          <RegisterForm />
        </div>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-neutral-medium">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}