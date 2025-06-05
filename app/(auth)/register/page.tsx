import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/forms/register-form'

export const metadata: Metadata = {
  title: 'Register - PorterGoldberg MVP',
  description: 'Create your PorterGoldberg account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-foreground-secondary">
            Join PorterGoldberg to start prospecting smarter
          </p>
        </div>

        <RegisterForm />

        <div className="text-center">
          <p className="text-sm text-foreground-secondary">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}