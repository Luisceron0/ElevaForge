'use client'

import { useState } from 'react'

interface Props {
  label: string
  value: string
  folder: 'projects' | 'about'
  onChange: (next: string) => void
  placeholder?: string
}

export default function ImageUploadInput({ label, value, folder, onChange, placeholder }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(file: File) {
    setError('')
    setUploading(true)

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', folder)

      const response = await fetch('/api/admin/uploads/image', {
        method: 'POST',
        body: form,
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo subir la imagen')
      }

      const publicUrl = String(payload?.publicUrl ?? '')
      if (!publicUrl) {
        throw new Error('La API no devolvió URL de la imagen')
      }

      onChange(publicUrl)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Error subiendo imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-forge-bg-dark">{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'URL de imagen (opcional)'}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <label className="inline-flex items-center justify-center border rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-forge-bg-light">
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
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value && (
        <div className="rounded-lg border border-forge-blue-mid/20 bg-forge-bg-light/50 p-2">
          <img src={value} alt="Vista previa" className="h-24 w-auto object-contain" />
        </div>
      )}
      <p className="text-xs text-forge-bg-dark/60">Opcional. Formatos: JPG, PNG, WEBP, GIF, AVIF (máx 5 MB).</p>
    </div>
  )
}
