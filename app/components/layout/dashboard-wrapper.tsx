'use client'

import { SidebarProvider } from '@/components/providers/sidebar-provider'
import { MobileHeader } from './mobile-header'
import { MobileSidebar } from './mobile-sidebar'
import { DashboardNav } from './dashboard-nav'

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-screen flex overflow-hidden bg-secondary">
        {/* Mobile header */}
        <MobileHeader />
        
        {/* Sidebar - Hidden on mobile, fixed on desktop */}
        <div className="hidden lg:flex w-64 bg-primary flex-shrink-0">
          <div className="h-full flex flex-col">
            <DashboardNav />
          </div>
        </div>
        
        {/* Mobile sidebar - Slide in from left */}
        <MobileSidebar />
        
        {/* Main content - Adjusts for mobile header */}
        <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}