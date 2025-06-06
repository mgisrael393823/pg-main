import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { RegisterForm } from '@/components/forms/register-form'

export const metadata: Metadata = {
  title: 'Register - PorterGoldberg MVP',
  description: 'Create your PorterGoldberg account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/pgreg.png"
            alt="PorterGoldberg"
            width={400}
            height={120}
            className="h-32 w-auto"
            priority
          />
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