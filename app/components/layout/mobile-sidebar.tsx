'use client'

import { useEffect } from 'react'
import { useSidebar } from '@/components/providers/sidebar-provider'
import { DashboardNav } from './dashboard-nav'

export function MobileSidebar() {
  const { isOpen, close } = useSidebar()

  // Close sidebar when clicking outside or navigating
  useEffect(() => {
    const handleRouteChange = () => {
      close()
    }

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [close])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col pt-16">
          <DashboardNav />
        </div>
      </div>
    </>
  )
}