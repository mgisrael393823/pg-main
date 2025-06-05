'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Something went wrong!
        </h2>
        <p className="text-foreground-secondary mb-6">
          An error occurred while loading this page.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}