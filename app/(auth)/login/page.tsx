import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { LoginForm } from '@/components/forms/login-form'

export const metadata: Metadata = {
  title: 'Login - PorterGoldberg MVP',
  description: 'Sign in to your PorterGoldberg account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/portergoldberg.png"
            alt="PorterGoldberg"
            width={400}
            height={120}
            className="h-32 w-auto"
            priority
          />
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