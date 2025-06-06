'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSidebar } from '@/components/providers/sidebar-provider'

export function MobileHeader() {
  const { isOpen, toggle } = useSidebar()

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-primary border-b border-accent-primary/20">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 text-secondary hover:bg-accent-primary/20 rounded-md transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link href="/dashboard" className="block">
            {/* Logo placeholder - replace src with your actual logo file */}
            <Image
              src="/images/logo.png"
              alt="PorterGoldberg Logo"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
      </div>
    </div>
  )
}