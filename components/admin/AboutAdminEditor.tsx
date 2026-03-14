'use client'

import { useEffect, useState } from 'react'
import { AboutContent } from '@/lib/site-content'

interface Props {
  about: AboutContent
  saving: boolean
  onSave: (about: AboutContent) => void
}

export default function AboutAdminEditor({ about, saving, onSave }: Props) {
  const [draft, setDraft] = useState<AboutContent>(normalizeAboutDraft(about))

  useEffect(() => {
    setDraft(normalizeAboutDraft(about))
  }, [about])

  function addPhase() {
    setDraft((prev) => ({
      ...prev,
      phases: [...prev.phases, { title: '', description: '' }],
    }))
  }

  function removePhase(index: number) {
    if (!window.confirm('¿Eliminar esta fase?')) return
    setDraft((prev) => ({
      ...prev,
      phases: prev.phases.filter((_, idx) => idx !== index),
    }))
  }

  function addDifferentiationItem() {
    setDraft((prev) => ({
      ...prev,
      pillars: [...prev.pillars, { title: '', description: '' }],
    }))
  }

  function removeDifferentiationItem(index: number) {
    if (!window.confirm('¿Eliminar este item?')) return
    setDraft((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((_, idx) => idx !== index),
    }))
  }

  function addSupportItem() {
    setDraft((prev) => ({ ...prev, supportItems: [...prev.supportItems, ''] }))
  }

  function removeSupportItem(index: number) {
    if (!window.confirm('¿Eliminar este item de soporte?')) return
    setDraft((prev) => ({
      ...prev,
      supportItems: prev.supportItems.filter((_, idx) => idx !== index),
    }))
  }

  function addExperienceItem() {
    setDraft((prev) => ({
      ...prev,
      experience: { ...prev.experience, items: [...prev.experience.items, ''] },
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
          <h2 className="text-xl font-semibold text-forge-bg-dark">Quiénes somos</h2>
          <p className="text-sm text-forge-bg-dark/70">Editor visual completo de la sección institucional.</p>
        </div>
        <button
          onClick={() => onSave(normalizeAboutDraft(draft))}
          disabled={saving}
          className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar sección'}
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-forge-bg-dark">Introducción</label>
        <textarea
          value={draft.intro}
          onChange={(e) => setDraft((prev) => ({ ...prev, intro: e.target.value }))}
          className="w-full min-h-[100px] border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <EntityListEditor
        title="Fases"
        items={draft.phases}
        onAdd={addPhase}
        onRemove={removePhase}
        onChange={(items) => setDraft((prev) => ({ ...prev, phases: items }))}
      />

      <EntityListEditor
        title="Pilares y diferenciadores"
        items={draft.pillars}
        onAdd={addDifferentiationItem}
        onRemove={removeDifferentiationItem}
        onChange={(items) => setDraft((prev) => ({ ...prev, pillars: items }))}
      />

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
          <h3 className="font-semibold text-forge-bg-dark">Caso de experiencia - items</h3>
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
          <h3 className="font-semibold text-forge-bg-dark">Proyectos en progreso</h3>
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-forge-bg-dark">Items de soporte</h3>
          <button onClick={addSupportItem} className="border rounded px-3 py-1 text-sm">Agregar item</button>
        </div>

        <div className="space-y-2">
          {draft.supportItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const next = [...draft.supportItems]
                  next[index] = e.target.value
                  setDraft((prev) => ({ ...prev, supportItems: next }))
                }}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button onClick={() => removeSupportItem(index)} className="border rounded px-3 py-2 text-sm text-red-600">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function normalizeAboutDraft(about: AboutContent): AboutContent {
  const mergedDifferentiationItems = dedupeAboutItems([...about.pillars, ...about.differentiators])

  const projectsInProgress = Array.isArray(about.projectsInProgress)
    ? about.projectsInProgress
    : [String(about.projectsInProgress ?? '').trim()].filter(Boolean)

  const experienceItems = Array.isArray(about.experience?.items)
    ? about.experience.items
    : []

  return {
    ...about,
    pillars: mergedDifferentiationItems,
    differentiators: [],
    projectsInProgress,
    supportItems: dedupeTextItems(about.supportItems),
    experience: {
      ...about.experience,
      items: dedupeTextItems(experienceItems),
    },
  }
}

function dedupeAboutItems(items: Entity[]): Entity[] {
  const seen = new Set<string>()
  const result: Entity[] = []

  for (const item of items) {
    const title = String(item?.title ?? '').trim()
    const description = String(item?.description ?? '').trim()
    if (!title || !description) continue

    const key = `${title.toLowerCase()}::${description.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push({ title, description })
  }

  return result
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

interface Entity {
  title: string
  description: string
}

interface EntityListEditorProps {
  title: string
  items: Entity[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (items: Entity[]) => void
}

function EntityListEditor({ title, items, onAdd, onRemove, onChange }: EntityListEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-forge-bg-dark">{title}</h3>
        <button onClick={onAdd} className="border rounded px-3 py-1 text-sm">Agregar</button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border p-3 space-y-2">
            <input
              value={item.title}
              onChange={(e) => {
                const next = [...items]
                next[index] = { ...next[index], title: e.target.value }
                onChange(next)
              }}
              placeholder="Título"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              value={item.description}
              onChange={(e) => {
                const next = [...items]
                next[index] = { ...next[index], description: e.target.value }
                onChange(next)
              }}
              placeholder="Descripción"
              className="w-full min-h-[80px] border rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={() => onRemove(index)} className="border rounded px-3 py-1 text-sm text-red-600">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
