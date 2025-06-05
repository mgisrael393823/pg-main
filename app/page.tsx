import { redirect } from 'next/navigation'
import { createServerSupabase } from './utils/supabase-server'

export default async function HomePage() {
  const supabase = createServerSupabase()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}