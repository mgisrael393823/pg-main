'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/utils/supabase-client'
import { User, LogOut, Moon, Sun, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/theme-provider'
import { useToast } from '@/components/providers/toast-provider'
import type { User as UserType } from '@/types/index'

interface DashboardHeaderProps {
  user: UserType | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabase()
  const { theme, setTheme } = useTheme()
  const { addToast } = useToast()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      addToast({
        type: 'error',
        title: 'Sign out failed',
        description: error.message,
      })
    } else {
      router.push('/login')
      router.refresh()
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">
              Real Estate Platform
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9 p-0"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full ring-2 ring-background" />
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 h-9 px-3"
              >
                <div className="h-7 w-7 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-accent-primary" />
                </div>
                <span className="text-sm font-medium hidden sm:inline-block">
                  {user?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
              </Button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-foreground-secondary">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-3 py-2 mt-1 text-sm text-foreground hover:bg-secondary rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}