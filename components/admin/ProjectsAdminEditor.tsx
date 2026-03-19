'use client'

import { useEffect, useState } from 'react'
import { AboutContent, ProjectItem } from '@/lib/site-content'
import ImageUploadInput from './ImageUploadInput'
import { isAssetRef } from '@/lib/asset-refs'

interface Props {
  projects: ProjectItem[]
  narrative: AboutContent['experience']
  saving: boolean
  narrativeSaving: boolean
  onSave: (projects: ProjectItem[]) => void
  onSaveNarrative: (value: AboutContent['experience']) => void
}

interface ProjectDraft {
  id: string
  title: string
  sector: string
  summary: string
  imageUrl: string
  externalUrl: string
  status: 'entregado' | 'en-curso'
  resultsText: string
}

const EMPTY_DRAFT: ProjectDraft = {
  id: '',
  title: '',
  sector: '',
  summary: '',
  imageUrl: '',
  externalUrl: '',
  status: 'entregado',
  resultsText: '',
}

function toDraft(item: ProjectItem): ProjectDraft {
  return {
    id: item.id,
    title: item.title,
    sector: item.sector,
    summary: item.summary,
    imageUrl: item.imageUrl || '',
    externalUrl: item.externalUrl || '',
    status: item.status,
    resultsText: item.results.join('\n'),
  }
}

function toProject(draft: ProjectDraft): ProjectItem {
  const slugBase = draft.id.trim() || draft.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const fallbackId = slugBase || `project-${Date.now()}`

  return {
    id: fallbackId,
    title: draft.title.trim(),
    sector: draft.sector.trim(),
    summary: draft.summary.trim(),
    imageUrl: draft.imageUrl.trim() || undefined,
    externalUrl: draft.externalUrl.trim() || undefined,
    status: draft.status,
    results: draft.resultsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  }
}

function validate(draft: ProjectDraft, items: ProjectItem[], editingIndex: number | null): string {
  const project = toProject(draft)
  if (!project.id || !/^[a-z0-9-]+$/i.test(project.id)) return 'No se pudo generar un ID válido para el proyecto'

  if (project.imageUrl && !isAssetRef(project.imageUrl)) {
    return 'La imagen debe ser ruta relativa, storage ref o URL http(s)'
  }

  const duplicate = items.findIndex((item, index) => item.id.toLowerCase() === project.id.toLowerCase() && index !== editingIndex)
  if (duplicate >= 0) return 'El ID ya existe en otro proyecto'

  return ''
}

export default function ProjectsAdminEditor({ projects, narrative, saving, narrativeSaving, onSave, onSaveNarrative }: Props) {
  const [narrativeDraft, setNarrativeDraft] = useState<AboutContent['experience']>({
    title: '',
    description: '',
    items: [],
    imageUrl: '',
  })
  const [items, setItems] = useState<ProjectItem[]>(projects)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [openProjectIndex, setOpenProjectIndex] = useState<number | null>(null)
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null)
  const [dragOverProjectIndex, setDragOverProjectIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<ProjectDraft>(EMPTY_DRAFT)
  const [error, setError] = useState('')

  useEffect(() => {
    setItems(projects)
  }, [projects])

  useEffect(() => {
    if (openProjectIndex === null) return
    if (openProjectIndex >= items.length) {
      setOpenProjectIndex(items.length > 0 ? items.length - 1 : null)
    }
  }, [items, openProjectIndex])

  useEffect(() => {
    setNarrativeDraft({
      title: String(narrative?.title ?? '').trim(),
      description: String(narrative?.description ?? '').trim(),
      items: Array.isArray(narrative?.items)
        ? narrative.items.map((item) => String(item ?? '').trim()).filter(Boolean)
        : [],
      imageUrl: String(narrative?.imageUrl ?? '').trim(),
    })
  }, [narrative])

  function addExperienceItem() {
    setNarrativeDraft((prev) => ({
      ...prev,
      items: [...prev.items, ''],
    }))
  }

  function removeExperienceItem(index: number) {
    if (!window.confirm('¿Eliminar este item de experiencia?')) return
    setNarrativeDraft((prev) => ({
      ...prev,
      items: prev.items.filter((_, currentIndex) => currentIndex !== index),
    }))
  }

  function saveNarrative() {
    onSaveNarrative({
      ...narrativeDraft,
      title: narrativeDraft.title.trim(),
      description: narrativeDraft.description.trim(),
      imageUrl: narrativeDraft.imageUrl?.trim() || undefined,
      items: narrativeDraft.items.map((item) => item.trim()).filter(Boolean),
    })
  }

  function startAdd() {
    setEditingIndex(items.length)
    setOpenProjectIndex(items.length)
    setDraft(EMPTY_DRAFT)
    setError('')
  }

  function startEdit(index: number) {
    setEditingIndex(index)
    setOpenProjectIndex(index)
    setDraft(toDraft(items[index]))
    setError('')
  }

  function cancelEdit() {
    setEditingIndex(null)
    setDraft(EMPTY_DRAFT)
    setError('')
  }

  function commitEdit() {
    const validation = validate(draft, items, editingIndex)
    if (validation) {
      setError(validation)
      return
    }

    const nextItem = toProject(draft)
    setItems((prev) => {
      const next = [...prev]
      if (editingIndex !== null && editingIndex < prev.length) {
        next[editingIndex] = nextItem
      } else {
        next.push(nextItem)
      }
      return next
    })

    cancelEdit()
  }

  function remove(index: number) {
    if (!window.confirm('¿Eliminar este proyecto?')) return
    setItems((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
    if (editingIndex === index) cancelEdit()
    setOpenProjectIndex((prev) => {
      if (prev === null) return prev
      if (prev === index) return null
      if (prev > index) return prev - 1
      return prev
    })
  }

  function reorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return
    if (!items[fromIndex] || !items[toIndex]) return

    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      if (!moved) return prev
      next.splice(toIndex, 0, moved)
      return next
    })

    setOpenProjectIndex((prev) => {
      if (prev === null) return prev
      if (prev === fromIndex) return toIndex
      if (fromIndex < prev && toIndex >= prev) return prev - 1
      if (fromIndex > prev && toIndex <= prev) return prev + 1
      return prev
    })
  }

  function resetDragState() {
    setDraggedProjectIndex(null)
    setDragOverProjectIndex(null)
  }

  function canDropOn(targetIndex: number): boolean {
    if (draggedProjectIndex === null) return false
    return !!items[draggedProjectIndex] && !!items[targetIndex]
  }

  function toggleProject(index: number) {
    setOpenProjectIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Proyectos y contexto</h3>
          <p className="text-sm text-white/60 mt-0.5">Gestiona narrativa y proyectos de forma individual</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startAdd}
            disabled={editingIndex !== null}
            className="border border-white/20 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10 disabled:opacity-40 transition-colors text-white"
          >
            + Proyecto
          </button>
          <button
            onClick={() => onSave(items)}
            disabled={saving || editingIndex !== null}
            className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-forge-orange-main/90 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-500 bg-red-950 text-red-200 px-4 py-3 text-sm">{error}</div>}

      <div className="rounded-xl border border-white/10 p-6 space-y-4 bg-white/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">Contexto institucional de proyectos</h3>
            <p className="text-xs text-white/60">Este bloque alimenta el caso de experiencia visible encima del listado de proyectos.</p>
          </div>
          <button
            onClick={saveNarrative}
            disabled={narrativeSaving}
            className="bg-forge-blue-mid text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {narrativeSaving ? 'Guardando...' : 'Guardar contexto'}
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Caso de experiencia - título</label>
          <input
            value={narrativeDraft.title}
            onChange={(e) => setNarrativeDraft((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Caso de experiencia - descripción</label>
          <textarea
            value={narrativeDraft.description}
            onChange={(e) => setNarrativeDraft((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full min-h-[90px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none"
          />
        </div>

        <ImageUploadInput
          label="Caso de experiencia - imagen"
          value={narrativeDraft.imageUrl || ''}
          folder="about"
          onChange={(next) => setNarrativeDraft((prev) => ({ ...prev, imageUrl: next }))}
          placeholder="URL imagen (opcional)"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white">Caso de experiencia - items</h4>
            <button onClick={addExperienceItem} className="border border-white/20 rounded px-3 py-1 text-sm text-white hover:bg-white/10 transition-colors">Agregar item</button>
          </div>

          <div className="space-y-2">
            {narrativeDraft.items.map((item, index) => (
              <div key={index} className="flex gap-2 group">
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...narrativeDraft.items]
                    next[index] = e.target.value
                    setNarrativeDraft((prev) => ({ ...prev, items: next }))
                  }}
                  className="flex-1 border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
                />
                <button onClick={() => removeExperienceItem(index)} className="border border-red-500/50 rounded px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-white/20 bg-white/5 px-3 py-2">
          <h3 className="text-sm font-semibold text-white">Listado de proyectos</h3>
          <span className="text-xs font-semibold text-white/70">{items.length}</span>
        </div>

        {items.map((project, index) => {
          const isEditing = editingIndex === index
          const isOpen = isEditing || openProjectIndex === index
          const isDropTarget = dragOverProjectIndex === index && canDropOn(index)

          return (
            <div
              key={project.id}
              className={`rounded-xl border bg-white/5 transition ${isDropTarget ? 'border-forge-blue-mid ring-2 ring-forge-blue-mid/20' : 'border-white/10'}`}
              onDragOver={(e) => {
                if (!canDropOn(index)) return
                e.preventDefault()
                setDragOverProjectIndex(index)
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (draggedProjectIndex === null || !canDropOn(index)) {
                  resetDragState()
                  return
                }

                reorder(draggedProjectIndex, index)
                resetDragState()
              }}
            >
              <button
                type="button"
                onClick={() => !isEditing && toggleProject(index)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div>
                  <p className="text-xs font-semibold text-white/60">Proyecto #{index + 1}</p>
                  <p className="font-semibold text-white">{project.title || 'Proyecto sin título'}</p>
                  <p className="text-xs text-white/60">ID: {project.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    draggable={editingIndex === null}
                    onClick={(e) => e.stopPropagation()}
                    onDragStart={(e) => {
                      if (editingIndex !== null) {
                        e.preventDefault()
                        return
                      }
                      setDraggedProjectIndex(index)
                      setDragOverProjectIndex(index)
                      e.dataTransfer.effectAllowed = 'move'
                    }}
                    onDragEnd={resetDragState}
                    className={`text-xs rounded px-2 py-1 border ${editingIndex === null ? 'cursor-grab active:cursor-grabbing border-white/20 text-white/60 hover:bg-white/10' : 'border-white/10 text-white/30 cursor-not-allowed'}`}
                    title="Arrastra para reordenar"
                  >
                    Arrastrar
                  </span>
                  <span className={getStatusBadgeClassName(project.status)}>{project.status}</span>
                  <span className="text-white/50 text-sm">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/10">
                  {isEditing ? (
                    <ProjectForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
                  ) : (
                    <>
                      <p className="text-sm text-forge-blue-mid font-semibold mt-2">{project.sector}</p>
                      <p className="text-sm text-white/70">{project.summary}</p>
                      <div className="text-xs text-white/60">
                        <p>Imagen: {project.imageUrl || 'Sin imagen'}</p>
                        {project.externalUrl && <p>URL externa: {project.externalUrl}</p>}
                      </div>
                      <ul className="text-sm text-white/75 list-disc pl-5">
                        {project.results.map((result) => (
                          <li key={result}>{result}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => startEdit(index)} disabled={editingIndex !== null} className="border border-white/20 rounded px-2 py-1 text-sm text-white hover:bg-white/10 disabled:opacity-40 transition-colors">Editar</button>
                        <button onClick={() => remove(index)} disabled={editingIndex !== null} className="border border-red-500/50 rounded px-2 py-1 text-sm text-red-300 hover:bg-red-900/20 disabled:opacity-40 transition-colors">Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {editingIndex === items.length && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <ProjectForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
        </div>
      )}

      {items.length === 0 && editingIndex === null && (
        <p className="text-sm text-white/60 text-center py-6">No hay proyectos. Usa Agregar proyecto para crear el primero.</p>
      )}
    </div>
  )
}

function getStatusBadgeClassName(status: ProjectItem['status']): string {
  return status === 'en-curso'
    ? 'text-xs rounded-full px-2 py-1 bg-orange-500/20 text-orange-300 font-semibold'
    : 'text-xs rounded-full px-2 py-1 bg-emerald-500/20 text-emerald-300 font-semibold'
}

interface FormProps {
  draft: ProjectDraft
  onChange: (next: ProjectDraft) => void
  onConfirm: () => void
  onCancel: () => void
}

function ProjectForm({ draft, onChange, onConfirm, onCancel }: FormProps) {
  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={draft.id} onChange={(e) => onChange({ ...draft, id: e.target.value })} placeholder="id (ej: avc)" className="border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50" />
        <select value={draft.status} onChange={(e) => onChange({ ...draft, status: e.target.value as 'entregado' | 'en-curso' })} className="border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50">
          <option value="entregado">entregado</option>
          <option value="en-curso">en-curso</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={draft.title} onChange={(e) => onChange({ ...draft, title: e.target.value })} placeholder="Título" className="border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50" />
        <input value={draft.sector} onChange={(e) => onChange({ ...draft, sector: e.target.value })} placeholder="Sector" className="border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50" />
      </div>
      <textarea value={draft.summary} onChange={(e) => onChange({ ...draft, summary: e.target.value })} placeholder="Resumen" className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none min-h-[90px]" />
      <ImageUploadInput
        label="Imagen del proyecto"
        value={draft.imageUrl}
        folder="projects"
        onChange={(next) => onChange({ ...draft, imageUrl: next })}
        placeholder="URL imagen (opcional)"
      />
      <input value={draft.externalUrl} onChange={(e) => onChange({ ...draft, externalUrl: e.target.value })} placeholder="URL externa (opcional)" className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50" />
      <textarea value={draft.resultsText} onChange={(e) => onChange({ ...draft, resultsText: e.target.value })} placeholder="Resultados, uno por línea" className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none min-h-[90px]" />
      <div className="flex gap-2">
        <button onClick={onConfirm} className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forge-orange-main/90 transition-colors">Confirmar</button>
        <button onClick={onCancel} className="border border-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">Cancelar</button>
      </div>
    </div>
  )
}
