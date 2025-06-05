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

  // Get user profile if needed in the future
  // const { data: userProfile } = await supabase
  //   .from('users')
  //   .select('*')
  //   .eq('id', session.user.id)
  //   .single()

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f8f9fa] border-r border-border">
        <DashboardNav />
      </aside>
      
      {/* Main content */}
      <main className="flex-1 px-8">
        {children}
      </main>
    </div>
  )
}