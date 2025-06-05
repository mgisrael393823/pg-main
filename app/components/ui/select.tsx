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
            'input-field',
            'bg-background',
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