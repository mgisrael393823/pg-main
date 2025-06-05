'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/utils/supabase-client'
import { useToast } from '@/components/providers/toast-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'agent' as 'admin' | 'agent' | 'viewer',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClientSupabase()
  const { addToast } = useToast()

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      addToast({
        type: 'error',
        title: 'Validation error',
        description: 'Please fill in all required fields.',
      })
      return false
    }

    if (formData.password.length < 8) {
      addToast({
        type: 'error',
        title: 'Validation error',
        description: 'Password must be at least 8 characters long.',
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      addToast({
        type: 'error',
        title: 'Validation error',
        description: 'Passwords do not match.',
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      })

      if (error) {
        addToast({
          type: 'error',
          title: 'Registration failed',
          description: error.message,
        })
        return
      }

      if (data.user) {
        addToast({
          type: 'success',
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        })
        
        // If email confirmation is disabled, redirect to dashboard
        if (data.session) {
          router.push('/dashboard')
          router.refresh()
        } else {
          router.push('/login')
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'An error occurred',
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            required
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            placeholder="Enter your email"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="mt-1"
          >
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4 text-foreground-muted" />
              ) : (
                <EyeIcon className="h-4 w-4 text-foreground-muted" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-foreground-muted">
            Must be at least 8 characters long
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-4 w-4 text-foreground-muted" />
              ) : (
                <EyeIcon className="h-4 w-4 text-foreground-muted" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}