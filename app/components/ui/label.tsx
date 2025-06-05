import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          'block text-sm font-medium text-foreground',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-error">*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'