'use client'

import { useEffect, useState } from 'react'
import { AboutContent } from '@/lib/site-content'

interface Props {
  about: AboutContent
  saving: boolean
  onSave: (about: AboutContent) => void
}

type TabType = 'intro' | 'fases' | 'pilares' | 'soporte'

export default function AboutAdminEditor({ about, saving, onSave }: Props) {
  const [draft, setDraft] = useState<AboutContent>(normalizeAboutDraft(about))
  const [activeTab, setActiveTab] = useState<TabType>('intro')

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

  const tabs = [
    { id: 'intro' as TabType, label: '📋 Introducción', icon: '📋' },
    { id: 'fases' as TabType, label: '📊 Fases', icon: '📊' },
    { id: 'pilares' as TabType, label: '🎯 Pilares', icon: '🎯' },
    { id: 'soporte' as TabType, label: '📌 Soporte', icon: '📌' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Quiénes somos</h3>
          <p className="text-sm text-white/60 mt-0.5">Editor de la sección institucional</p>
        </div>
        <button
          type="button"
          onClick={() => onSave(normalizeAboutDraft(draft))}
          disabled={saving}
          className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forge-orange-main/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-white/10 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-forge-orange-main text-forge-orange-main'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="border border-white/10 rounded-xl p-6 space-y-4 min-h-[400px] bg-white/5">
        {/* Tab: Introducción */}
        {activeTab === 'intro' && (
          <div className="space-y-4 animate-in fade-in-50">
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Introducción</label>
              <p className="text-xs text-white/60 mb-3">Texto principal que aparece en la sección "Quiénes somos"</p>
              <textarea
                value={draft.intro}
                onChange={(e) => setDraft((prev) => ({ ...prev, intro: e.target.value }))}
                placeholder="Escribe la introducción de tu empresa..."
                className="w-full min-h-[280px] border border-white/20 rounded-lg px-4 py-3 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none"
              />
              <p className="text-xs text-white/40 mt-2">{draft.intro.length} caracteres</p>
            </div>
          </div>
        )}

        {/* Tab: Fases */}
        {activeTab === 'fases' && (
          <div className="space-y-4 animate-in fade-in-50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">Fases del proceso</h4>
                  <p className="text-xs text-white/60 mt-1">Define las fases o etapas de tu proceso</p>
                </div>
                <button
                  type="button"
                  onClick={addPhase}
                  className="text-xs border border-white/20 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors font-medium text-white"
                >
                  + Agregar fase
                </button>
              </div>
              <EntityListEditor
                title=""
                items={draft.phases}
                onAdd={addPhase}
                onRemove={removePhase}
                onChange={(items) => setDraft((prev) => ({ ...prev, phases: items }))}
                showTitle={false}
              />
            </div>
          </div>
        )}

        {/* Tab: Pilares */}
        {activeTab === 'pilares' && (
          <div className="space-y-4 animate-in fade-in-50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">Pilares y diferenciadores</h4>
                  <p className="text-xs text-white/60 mt-1">Lo que te hace diferente en el mercado</p>
                </div>
                <button
                  type="button"
                  onClick={addDifferentiationItem}
                  className="text-xs border border-white/20 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors font-medium text-white"
                >
                  + Agregar pilar
                </button>
              </div>
              <EntityListEditor
                title=""
                items={draft.pillars}
                onAdd={addDifferentiationItem}
                onRemove={removeDifferentiationItem}
                onChange={(items) => setDraft((prev) => ({ ...prev, pillars: items }))}
                showTitle={false}
              />
            </div>
          </div>
        )}

        {/* Tab: Soporte */}
        {activeTab === 'soporte' && (
          <div className="space-y-4 animate-in fade-in-50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">Items de soporte</h4>
                  <p className="text-xs text-white/60 mt-1">Servicios adicionales o garantías</p>
                </div>
                <button
                  type="button"
                  onClick={addSupportItem}
                  className="text-xs border border-white/20 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors font-medium text-white"
                >
                  + Agregar item
                </button>
              </div>

              <div className="space-y-3">
                {draft.supportItems.length === 0 ? (
                  <p className="text-sm text-white/50 text-center py-8">No hay items de soporte. Haz clic en "+ Agregar item" para crear uno.</p>
                ) : (
                  draft.supportItems.map((item, index) => (
                    <div key={index} className="flex gap-2 group">
                      <input
                        value={item}
                        onChange={(e) => {
                          const next = [...draft.supportItems]
                          next[index] = e.target.value
                          setDraft((prev) => ({ ...prev, supportItems: next }))
                        }}
                        placeholder="Ej: Soporte 24/7"
                        className="flex-1 border border-white/20 rounded-lg px-4 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
                      />
                      <button
                        type="button"
                        onClick={() => removeSupportItem(index)}
                        className="border border-red-500/50 text-red-300 rounded-lg px-3 py-2 text-xs hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="text-xs text-white/50 flex items-center gap-2">
        <span>💡</span>
        <span>Todos los cambios se guardan con el botón "Guardar" en la parte superior</span>
      </div>
    </div>
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
  showTitle?: boolean
}

function EntityListEditor({ title, items, onAdd, onRemove, onChange, showTitle = true }: EntityListEditorProps) {
  return (
    <div className={showTitle ? "space-y-3 pt-2 border-t border-white/10" : "space-y-3"}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-white">{title}</h4>
          <button type="button" onClick={onAdd} className="text-xs border border-white/20 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors text-white">+ Agregar</button>
        </div>
      )}

      <div className={showTitle ? "space-y-2" : "space-y-3"}>
        {items.length === 0 ? (
          <p className="text-sm text-white/50 text-center py-8">No hay items. Haz clic en "+ Agregar" para crear uno.</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-5 space-y-3 group hover:border-white/20 transition-colors">
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-2">Título</label>
                <input
                  value={item.title}
                  onChange={(e) => {
                    const next = [...items]
                    next[index] = { ...next[index], title: e.target.value }
                    onChange(next)
                  }}
                  placeholder="Ej: Análisis Completo"
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-2">Descripción</label>
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const next = [...items]
                    next[index] = { ...next[index], description: e.target.value }
                    onChange(next)
                  }}
                  placeholder="Describe esta fase o pilar..."
                  className="w-full min-h-[100px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-xs border border-red-500/50 text-red-300 rounded-lg px-3 py-1.5 hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
