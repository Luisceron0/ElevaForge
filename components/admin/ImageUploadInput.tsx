'use client'

import { useState } from 'react'
import { extractStoragePath } from '@/lib/asset-refs'

const MAX_DIMENSION = 1600
const WEBP_QUALITY = 0.82

function replaceFileExtension(filename: string, newExtension: string): string {
  const cleanName = filename.replace(/\.[^.]+$/, '') || 'image'
  return `${cleanName}.${newExtension}`
}

async function loadImageElement(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('No se pudo procesar la imagen'))
      img.src = objectUrl
    })

    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function compressImageIfNeeded(file: File): Promise<File> {
  if (file.type === 'image/gif') {
    return file
  }

  if (!file.type.startsWith('image/')) {
    return file
  }

  const image = await loadImageElement(file)
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height
  if (!width || !height) {
    return file
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
  const targetWidth = Math.max(1, Math.round(width * scale))
  const targetHeight = Math.max(1, Math.round(height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext('2d')
  if (!context) {
    return file
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/webp', WEBP_QUALITY)
  })

  if (!blob) {
    return file
  }

  if (blob.size >= file.size && scale === 1 && file.type === 'image/webp') {
    return file
  }

  return new File([blob], replaceFileExtension(file.name, 'webp'), {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}

interface Props {
  label: string
  value: string
  folder: 'projects' | 'about' | 'members'
  onChange: (next: string) => void
  placeholder?: string
}

export default function ImageUploadInput({ label, value, folder, onChange, placeholder }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadHint, setUploadHint] = useState('')
  const [previewOverride, setPreviewOverride] = useState('')

  const previewSrc = previewOverride || getPreviewSrc(value)

  async function handleUpload(file: File) {
    setError('')
    setUploadHint('')
    setPreviewOverride('')
    setUploading(true)

    try {
      const optimizedFile = await compressImageIfNeeded(file)

      const form = new FormData()
      form.append('file', optimizedFile)
      form.append('folder', folder)

      const response = await fetch('/api/admin/uploads/image', {
        method: 'POST',
        body: form,
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo subir la imagen')
      }

      const assetRef = String(payload?.assetRef ?? '')
      const previewUrl = String(payload?.previewUrl ?? '')
      if (!assetRef) {
        throw new Error('La API no devolvió referencia de la imagen')
      }

      if (optimizedFile !== file) {
        const originalKb = Math.max(1, Math.round(file.size / 1024))
        const optimizedKb = Math.max(1, Math.round(optimizedFile.size / 1024))
        setUploadHint(`Optimizada antes de subir: ${originalKb} KB -> ${optimizedKb} KB`)
      } else {
        setUploadHint('Imagen subida sin compresión adicional')
      }

      setPreviewOverride(previewUrl)
      onChange(assetRef)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Error subiendo imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'URL de imagen (opcional)'}
          className="flex-1 border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
        />
        <label className="inline-flex items-center justify-center border border-white/20 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-white/10 text-white transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                void handleUpload(file)
              }
              e.currentTarget.value = ''
            }}
            disabled={uploading}
          />
          {uploading ? 'Subiendo...' : 'Subir imagen'}
        </label>
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
      {uploadHint && <p className="text-xs text-emerald-300">{uploadHint}</p>}
      {previewSrc && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <img src={previewSrc} alt="Vista previa" className="h-24 w-auto object-contain" />
        </div>
      )}
      <p className="text-xs text-white/60">Opcional. Formatos: JPG, PNG, WEBP, GIF, AVIF (máx 5 MB). Las imágenes estáticas se optimizan automáticamente a WebP y máximo 1600 px.</p>
    </div>
  )
}

function getPreviewSrc(value: string): string {
  const raw = value.trim()
  if (!raw) return ''
  if (extractStoragePath(raw)) {
    return `/api/admin/uploads/preview?ref=${encodeURIComponent(raw)}`
  }

  return raw
}
