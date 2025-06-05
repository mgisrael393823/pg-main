import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/utils/supabase-server'
import { DashboardNav } from '@/components/layout/dashboard-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabase()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Temporarily disable auth check for testing
  // if (!session) {
  //   redirect('/login')
  // }

  return (
    <div className="h-screen flex overflow-hidden bg-secondary">
      {/* Sidebar - Fixed width and height */}
      <div className="w-64 bg-primary flex-shrink-0">
        <div className="h-full flex flex-col">
          <DashboardNav />
        </div>
      </div>
      
      {/* Main content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
