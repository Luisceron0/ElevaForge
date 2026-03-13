'use client'

import { useEffect, useState } from 'react'
import { AboutContent } from '@/lib/site-content'

interface Props {
  about: AboutContent
  saving: boolean
  onSave: (about: AboutContent) => void
}

export default function AboutAdminEditor({ about, saving, onSave }: Props) {
  const [draft, setDraft] = useState<AboutContent>(about)

  useEffect(() => {
    setDraft(about)
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

  function addPillar() {
    setDraft((prev) => ({
      ...prev,
      pillars: [...prev.pillars, { title: '', description: '' }],
    }))
  }

  function removePillar(index: number) {
    if (!window.confirm('¿Eliminar este pilar?')) return
    setDraft((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((_, idx) => idx !== index),
    }))
  }

  function addDifferentiator() {
    setDraft((prev) => ({
      ...prev,
      differentiators: [...prev.differentiators, { title: '', description: '' }],
    }))
  }

  function removeDifferentiator(index: number) {
    if (!window.confirm('¿Eliminar este diferenciador?')) return
    setDraft((prev) => ({
      ...prev,
      differentiators: prev.differentiators.filter((_, idx) => idx !== index),
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

  return (
    <section className="bg-white rounded-2xl shadow p-5 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-forge-bg-dark">Quiénes somos</h2>
          <p className="text-sm text-forge-bg-dark/70">Editor visual completo de la sección institucional.</p>
        </div>
        <button
          onClick={() => onSave(draft)}
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
        title="Pilares"
        items={draft.pillars}
        onAdd={addPillar}
        onRemove={removePillar}
        onChange={(items) => setDraft((prev) => ({ ...prev, pillars: items }))}
      />

      <EntityListEditor
        title="Diferenciadores"
        items={draft.differentiators}
        onAdd={addDifferentiator}
        onRemove={removeDifferentiator}
        onChange={(items) => setDraft((prev) => ({ ...prev, differentiators: items }))}
      />

      <div className="grid sm:grid-cols-2 gap-3">
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
          <label className="block text-sm font-semibold text-forge-bg-dark">Proyectos en progreso</label>
          <input
            value={draft.projectsInProgress}
            onChange={(e) => setDraft((prev) => ({ ...prev, projectsInProgress: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
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
