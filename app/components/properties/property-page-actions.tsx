'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload, Map } from 'lucide-react'

export function PropertyPageActions() {
  const router = useRouter()

  return (
    <>
      <Button variant="outline">
        <Map className="h-4 w-4 mr-2" />
        Map View
      </Button>
      <Button onClick={() => router.push('/upload')}>
        <Upload className="h-4 w-4 mr-2" />
        Upload PropStream CSV
      </Button>
    </>
  )
}

export function UploadButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push('/upload')}>
      Upload CSV File
    </Button>
  )
}