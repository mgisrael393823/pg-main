'use client'

import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={clsx(
            'flex min-h-[44px] sm:h-10 w-full rounded-md border border-neutral-medium/20 bg-white px-3 py-2 text-base sm:text-sm',
            'placeholder:text-neutral-medium/50',
            'focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'