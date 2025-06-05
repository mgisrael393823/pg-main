'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, 
  Users, 
  Building2, 
  Bell, 
  BarChart3,
  Settings,
  Upload,
  LogOut,
  User
} from 'lucide-react'
import { clsx } from 'clsx'
import { createClientSupabase } from '@/utils/supabase-client'
import { useToast } from '@/components/providers/toast-provider'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/upload', label: 'Import Data', icon: Upload },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { addToast } = useToast()
  const supabase = createClientSupabase()

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

  return (
    <div className="flex flex-col h-full">
      {/* Header - matches main content header */}
      <div className="h-20 flex items-center px-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">PorterGoldberg</h2>
          <p className="text-xs text-[#6b7280] font-light uppercase tracking-wider">MVP Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-6">
          <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href as any}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm',
                    isActive
                      ? 'bg-[#2d3e2d] text-white'
                      : 'text-[#4b5563] hover:bg-gray-200 hover:text-[#2d3748]'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-[#4b5563]" />
              </div>
              <span className="text-sm font-medium text-[#1a1a1a] uppercase">User</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-[#6b7280] hover:text-[#1a1a1a] hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
    </div>
  )
}