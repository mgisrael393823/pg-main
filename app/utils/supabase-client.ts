import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

// Client-side Supabase client
export const createClientSupabase = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Client-side utility functions
export const supabaseClient = {
  // Check if user is authenticated
  async isAuthenticated() {
    const supabase = createClientSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  },

  // Get current user with profile
  async getCurrentUser() {
    const supabase = createClientSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return { user, profile }
  },

  // Sign out utility
  async signOut() {
    const supabase = createClientSupabase()
    await supabase.auth.signOut()
  },

  // Format error messages
  formatError(error: any): string {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error_description) return error.error_description
    return 'An unexpected error occurred'
  },

  // Handle API responses
  handleResponse<T>(response: { data: T | null; error: any }) {
    if (response.error) {
      throw new Error(this.formatError(response.error))
    }
    return response.data
  },
}