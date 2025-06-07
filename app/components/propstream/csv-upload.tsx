'use client'

import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { useRouter } from 'next/navigation'
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/providers/toast-provider'
import { formatFileSize } from '@/utils/format'
import { validateFileSize, validateFileType } from '@/utils/validation'
import { FILE_UPLOAD } from '@/utils/constants'

interface UploadState {
  file: File | null
  isUploading: boolean
  progress: number
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error'
  error: string | null
  results: {
    total: number
    processed: number
    successful: number
    failed: number
  } | null
  preview: string[][] | null
}

export function PropStreamCSVUpload() {
  const [state, setState] = useState<UploadState>({
    file: null,
    isUploading: false,
    progress: 0,
    status: 'idle',
    error: null,
    results: null,
    preview: null,
  })

  const router = useRouter()
  const { addToast } = useToast()

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!validateFileType(file, FILE_UPLOAD.ALLOWED_TYPES as unknown as string[])) {
      addToast({
        type: 'error',
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
      })
      return
    }

    if (!validateFileSize(file, FILE_UPLOAD.MAX_SIZE_MB)) {
      addToast({
        type: 'error',
        title: 'File too large',
        description: `Maximum file size is ${FILE_UPLOAD.MAX_SIZE_MB}MB`,
      })
      return
    }
    // Parse first 5 rows for preview
    const text = await file.text()
    const previewRows = Papa.parse<string[]>(text, {
      preview: 5,
    }).data as string[][]

    setState(prev => ({
      ...prev,
      file,
      error: null,
      status: 'idle',
      preview: previewRows,
    }))
  }, [addToast])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Create a fake change event to reuse validation logic
    const input = document.createElement('input')
    input.type = 'file'
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    })
    const fakeEvent = new Event('change', { bubbles: true }) as unknown as React.ChangeEvent<HTMLInputElement>
    Object.defineProperty(fakeEvent, 'target', {
      value: input,
      writable: false,
    })
    
    handleFileSelect(fakeEvent)
  }, [handleFileSelect])

  const handleUpload = async () => {
    if (!state.file) return

    setState(prev => ({ ...prev, isUploading: true, status: 'uploading', progress: 0 }))

    const formData = new FormData()
    formData.append('file', state.file)

    try {
      const response = await fetch('/api/properties/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const result = await response.json()

      setState(prev => ({
        ...prev,
        isUploading: false,
        status: 'completed',
        progress: 100,
        results: result,
      }))

      addToast({
        type: 'success',
        title: 'Upload completed',
        description: `Successfully processed ${result.successful} properties`,
      })

      // Refresh the page after a delay
      setTimeout(() => {
        router.refresh()
      }, 2000)

    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      }))

      addToast({
        type: 'error',
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const removeFile = () => {
    setState({
      file: null,
      isUploading: false,
      progress: 0,
      status: 'idle',
      error: null,
      results: null,
      preview: null,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PropStream CSV</CardTitle>
      </CardHeader>
      <CardContent>
        {!state.file ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent-primary transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <Upload className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drop your PropStream CSV here
            </h3>
            <p className="text-sm text-foreground-secondary mb-4">
              or click to browse from your computer
            </p>
            <p className="text-xs text-foreground-muted">
              Maximum file size: {FILE_UPLOAD.MAX_SIZE_MB}MB
            </p>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* File info */}
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-accent-primary" />
                <div>
                  <p className="font-medium text-foreground">{state.file.name}</p>
                  <p className="text-sm text-foreground-secondary">
                    {formatFileSize(state.file.size)}
                  </p>
                </div>
              </div>
              {state.status === 'idle' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {state.preview && (
              <div className="overflow-auto border border-border rounded-lg text-sm">
                <table className="min-w-full text-left">
                  <tbody>
                    {state.preview.map((row, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        {row.map((cell, j) => (
                          <td key={j} className="px-2 py-1 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Upload status */}
            {state.status !== 'idle' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-secondary">
                    {state.status === 'uploading' && 'Uploading...'}
                    {state.status === 'processing' && 'Processing...'}
                    {state.status === 'completed' && 'Completed'}
                    {state.status === 'error' && 'Failed'}
                  </span>
                  <span className="text-foreground">
                    {state.progress}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      state.status === 'error' ? 'bg-error' : 'bg-accent-primary'
                    }`}
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Results */}
            {state.results && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {state.results.total}
                  </p>
                  <p className="text-sm text-foreground-secondary">Total Rows</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    {state.results.successful}
                  </p>
                  <p className="text-sm text-foreground-secondary">Imported</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-error">
                    {state.results.failed}
                  </p>
                  <p className="text-sm text-foreground-secondary">Failed</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {state.error && (
              <div className="flex items-center gap-2 p-3 bg-error/10 text-error rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{state.error}</p>
              </div>
            )}

            {/* Actions */}
            {state.status === 'idle' && (
              <div className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={!state.file}
                  className="flex-1"
                >
                  Upload and Process
                </Button>
                <Button
                  variant="outline"
                  onClick={removeFile}
                >
                  Cancel
                </Button>
              </div>
            )}

            {state.status === 'completed' && (
              <Button
                onClick={() => router.push('/properties')}
                className="w-full"
              >
                View Properties
              </Button>
            )}
          </div>
        )}

        {/* Requirements info */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Required PropStream Fields:
          </h4>
          <ul className="text-xs text-foreground-secondary space-y-1">
            <li>• Property Address, City, State, Zip Code</li>
            <li>• Owner Name & Contact Information</li>
            <li>• Property Details (Bedrooms, Bathrooms, Square Feet)</li>
            <li>• Estimated Value & Tax Information</li>
            <li>• County & Property Type</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}