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
import { useSidebar } from '@/components/providers/sidebar-provider'

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    ]
  },
  {
    label: 'CRM',
    items: [
      { href: '/contacts', label: 'Contacts', icon: Users },
      { href: '/properties', label: 'Properties', icon: Building2 },
      { href: '/alerts', label: 'Alerts', icon: Bell },
    ]
  },
  {
    label: 'Tools',
    items: [
      { href: '/upload', label: 'Import Data', icon: Upload },
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  }
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { addToast } = useToast()
  const supabase = createClientSupabase()
  
  // Try to use sidebar context, but don't fail if not available
  let closeSidebar: () => void = () => {}
  try {
    const sidebar = useSidebar()
    closeSidebar = sidebar.close
  } catch {
    // Not in sidebar context, that's ok
  }

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
    <div className="h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="h-20 px-6 flex-shrink-0 border-b border-accent-primary/20 flex items-center">
        <Link href="/dashboard" className="block">
          <h1 className="text-xl font-semibold text-secondary">PorterGoldberg</h1>
          <p className="text-sm text-secondary/60">Internal Dashboard</p>
        </Link>
      </div>

      {/* Navigation - Scrollable if needed */}
      <nav className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {navSections.map((section, sectionIndex) => (
            <div key={section.label}>
              <h3 className="text-xs font-semibold text-secondary/50 uppercase tracking-wider mb-3">
                {section.label}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeSidebar}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 text-sm',
                          isActive
                            ? 'bg-accent-primary text-secondary font-medium'
                            : 'text-secondary/80 hover:bg-accent-primary/20 hover:text-secondary'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* User section - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-accent-primary/20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-accent-primary flex items-center justify-center">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary truncate">User</p>
                <p className="text-xs text-secondary/60 truncate">user@example.com</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-secondary/60 hover:text-secondary hover:bg-accent-primary/20 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
