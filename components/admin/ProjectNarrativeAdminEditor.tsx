'use client'

import { useEffect, useState } from 'react'

interface ProjectNarrativeValue {
  experience: {
    title: string
    description: string
    items: string[]
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
    <section className="bg-white rounded-2xl shadow p-5 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-forge-bg-dark">Contexto de proyectos</h3>
          <p className="text-sm text-forge-bg-dark/70">
            Gestiona el texto institucional que acompaña proyectos terminados y en desarrollo.
          </p>
        </div>
        <button
          onClick={() => onSave(normalizeDraft(draft))}
          disabled={saving}
          className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar contexto'}
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-forge-bg-dark">Caso de experiencia - título</label>
        <input
          value={draft.experience.title}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              experience: { ...prev.experience, title: e.target.value },
            }))
          }
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-forge-bg-dark">Caso de experiencia - descripción</label>
        <textarea
          value={draft.experience.description}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              experience: { ...prev.experience, description: e.target.value },
            }))
          }
          className="w-full min-h-[90px] border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-forge-bg-dark">Caso de experiencia - items</h4>
          <button onClick={addExperienceItem} className="border rounded px-3 py-1 text-sm">Agregar item</button>
        </div>

        <div className="space-y-2">
          {draft.experience.items.map((item, index) => (
            <div key={index} className="flex gap-2">
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
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button onClick={() => removeExperienceItem(index)} className="border rounded px-3 py-2 text-sm text-red-600">Eliminar</button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-forge-bg-dark">Proyectos en progreso</h4>
          <button onClick={addProjectInProgressItem} className="border rounded px-3 py-1 text-sm">Agregar item</button>
        </div>

        <div className="space-y-2">
          {draft.projectsInProgress.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const next = [...draft.projectsInProgress]
                  next[index] = e.target.value
                  setDraft((prev) => ({ ...prev, projectsInProgress: next }))
                }}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button onClick={() => removeProjectInProgressItem(index)} className="border rounded px-3 py-2 text-sm text-red-600">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </section>
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