import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/utils/supabase-server'
import { DashboardWrapper } from '../components/layout/dashboard-wrapper'

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

  return <DashboardWrapper>{children}</DashboardWrapper>
}
