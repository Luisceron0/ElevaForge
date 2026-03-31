'use client'

import { useEffect, useState } from 'react'
import ImageUploadInput from './ImageUploadInput'

interface ProjectNarrativeValue {
  experience: {
    title: string
    description: string
    items: string[]
    imageUrl?: string
  }
  projectsInProgress: string[]
}

interface Props {
  value: ProjectNarrativeValue
  saving: boolean
  onSave: (value: ProjectNarrativeValue) => void
}

export default function ProjectNarrativeAdminEditor({ value, saving, onSave }: Props) {
  const [draft, setDraft] = useState<ProjectNarrativeValue>(normalizeDraft(value))

  useEffect(() => {
    setDraft(normalizeDraft(value))
  }, [value])

  function addExperienceItem() {
    setDraft((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: [...prev.experience.items, ''],
      },
    }))
  }

  function removeExperienceItem(index: number) {
    if (!window.confirm('¿Eliminar este item del caso de experiencia?')) return
    setDraft((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: prev.experience.items.filter((_, idx) => idx !== index),
      },
    }))
  }

  function addProjectInProgressItem() {
    setDraft((prev) => ({
      ...prev,
      projectsInProgress: [...prev.projectsInProgress, ''],
    }))
  }

  function removeProjectInProgressItem(index: number) {
    if (!window.confirm('¿Eliminar este item de proyectos en progreso?')) return
    setDraft((prev) => ({
      ...prev,
      projectsInProgress: prev.projectsInProgress.filter((_, idx) => idx !== index),
    }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Contexto de proyectos</h3>
          <p className="text-sm text-white/60">
            Gestiona el texto institucional que acompaña proyectos terminados y en desarrollo.
          </p>
        </div>
        <button
          onClick={() => onSave(normalizeDraft(draft))}
          disabled={saving}
          className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-forge-orange-main/90 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar contexto'}
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Caso de experiencia - título</label>
        <input
          value={draft.experience.title}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              experience: { ...prev.experience, title: e.target.value },
            }))
          }
          className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Caso de experiencia - descripción</label>
        <textarea
          value={draft.experience.description}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              experience: { ...prev.experience, description: e.target.value },
            }))
          }
          className="w-full min-h-[90px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none"
        />
      </div>

      <ImageUploadInput
        label="Caso de experiencia - imagen"
        value={draft.experience.imageUrl || ''}
        folder="about"
        onChange={(next) =>
          setDraft((prev) => ({
            ...prev,
            experience: { ...prev.experience, imageUrl: next },
          }))
        }
        placeholder="URL imagen (opcional)"
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">Caso de experiencia - items</h4>
          <button onClick={addExperienceItem} className="border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white hover:bg-white/10 transition-colors">+ Agregar item</button>
        </div>

        <div className="space-y-2">
          {draft.experience.items.map((item, index) => (
            <div key={index} className="flex gap-2 group">
              <input
                value={item}
                onChange={(e) => {
                  const next = [...draft.experience.items]
                  next[index] = e.target.value
                  setDraft((prev) => ({
                    ...prev,
                    experience: { ...prev.experience, items: next },
                  }))
                }}
                className="flex-1 border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
              />
              <button onClick={() => removeExperienceItem(index)} className="border border-red-500/50 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">Eliminar</button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">Proyectos en progreso</h4>
          <button onClick={addProjectInProgressItem} className="border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white hover:bg-white/10 transition-colors">+ Agregar item</button>
        </div>

        <div className="space-y-2">
          {draft.projectsInProgress.map((item, index) => (
            <div key={index} className="flex gap-2 group">
              <input
                value={item}
                onChange={(e) => {
                  const next = [...draft.projectsInProgress]
                  next[index] = e.target.value
                  setDraft((prev) => ({ ...prev, projectsInProgress: next }))
                }}
                className="flex-1 border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
              />
              <button onClick={() => removeProjectInProgressItem(index)} className="border border-red-500/50 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function normalizeDraft(value: ProjectNarrativeValue): ProjectNarrativeValue {
  const experienceItems = dedupeTextItems(
    Array.isArray(value?.experience?.items) ? value.experience.items : [],
  )

  return {
    experience: {
      title: String(value?.experience?.title ?? '').trim(),
      description: String(value?.experience?.description ?? '').trim(),
      items: experienceItems,
      imageUrl: String(value?.experience?.imageUrl ?? '').trim(),
    },
    projectsInProgress: dedupeTextItems(
      Array.isArray(value?.projectsInProgress) ? value.projectsInProgress : [],
    ),
  }
}

function dedupeTextItems(items: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const item of items) {
    const value = String(item ?? '').trim()
    if (!value) continue
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(value)
  }

  return result
}