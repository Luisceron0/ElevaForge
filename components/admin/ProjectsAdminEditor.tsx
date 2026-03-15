'use client'

import { useEffect, useState } from 'react'
import { AboutContent, ProjectItem } from '@/lib/site-content'
import ImageUploadInput from './ImageUploadInput'
import { isAssetRef } from '@/lib/asset-refs'

interface Props {
  projects: ProjectItem[]
  narrative: {
    experience: AboutContent['experience']
    projectsInProgress: string[]
  }
  saving: boolean
  narrativeSaving: boolean
  onSave: (projects: ProjectItem[]) => void
  onSaveNarrative: (value: { experience: AboutContent['experience']; projectsInProgress: string[] }) => void
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
  const p = toProject(draft)
  if (!p.id || !/^[a-z0-9-]+$/i.test(p.id)) return 'No se pudo generar un ID válido para el proyecto'

  if (p.imageUrl && !isAssetRef(p.imageUrl)) {
    return 'La imagen debe ser ruta relativa, storage ref o URL http(s)'
  }

  const duplicate = items.findIndex((x, idx) => x.id.toLowerCase() === p.id.toLowerCase() && idx !== editingIndex)
  if (duplicate >= 0) return 'El ID ya existe en otro proyecto'

  return ''
}

export default function ProjectsAdminEditor({ projects, narrative, saving, narrativeSaving, onSave, onSaveNarrative }: Props) {
  const [narrativeDraft, setNarrativeDraft] = useState<{ experience: AboutContent['experience']; projectsInProgress: string[] }>(
    {
      experience: {
        title: '',
        description: '',
        items: [],
        imageUrl: '',
      },
      projectsInProgress: [],
    },
  )
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
      experience: {
        title: String(narrative.experience?.title ?? '').trim(),
        description: String(narrative.experience?.description ?? '').trim(),
        items: Array.isArray(narrative.experience?.items)
          ? narrative.experience.items.map((item) => String(item ?? '').trim()).filter(Boolean)
          : [],
        imageUrl: String(narrative.experience?.imageUrl ?? '').trim(),
      },
      projectsInProgress: Array.isArray(narrative.projectsInProgress)
        ? narrative.projectsInProgress.map((item) => String(item ?? '').trim()).filter(Boolean)
        : [],
    })
  }, [narrative])

  function addExperienceItem() {
    setNarrativeDraft((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: [...prev.experience.items, ''],
      },
    }))
  }

  function removeExperienceItem(index: number) {
    if (!window.confirm('¿Eliminar este item de experiencia?')) return
    setNarrativeDraft((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: prev.experience.items.filter((_, idx) => idx !== index),
      },
    }))
  }

  function addInProgressItem() {
    setNarrativeDraft((prev) => ({
      ...prev,
      projectsInProgress: [...prev.projectsInProgress, ''],
    }))
  }

  function removeInProgressItem(index: number) {
    if (!window.confirm('¿Eliminar este item de proyectos en progreso?')) return
    setNarrativeDraft((prev) => ({
      ...prev,
      projectsInProgress: prev.projectsInProgress.filter((_, idx) => idx !== index),
    }))
  }

  function saveNarrative() {
    onSaveNarrative({
      experience: {
        ...narrativeDraft.experience,
        title: narrativeDraft.experience.title.trim(),
        description: narrativeDraft.experience.description.trim(),
        imageUrl: narrativeDraft.experience.imageUrl?.trim() || undefined,
        items: narrativeDraft.experience.items.map((item) => item.trim()).filter(Boolean),
      },
      projectsInProgress: narrativeDraft.projectsInProgress.map((item) => item.trim()).filter(Boolean),
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
    setItems((prev) => prev.filter((_, idx) => idx !== index))
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
    if (items[fromIndex].status !== items[toIndex].status) return

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
    if (!items[draggedProjectIndex] || !items[targetIndex]) return false
    return items[draggedProjectIndex].status === items[targetIndex].status
  }

  function toggleProject(index: number) {
    setOpenProjectIndex((prev) => (prev === index ? null : index))
  }

  const deliveredProjects = items
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => project.status === 'entregado')
  const inProgressProjects = items
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => project.status === 'en-curso')

  return (
    <section className="bg-white rounded-2xl shadow p-5 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-forge-bg-dark">Proyectos y contexto</h2>
          <p className="text-sm text-forge-bg-dark/70">Gestiona en un solo panel el contexto narrativo y cada proyecto de forma individual.</p>
          <p className="text-xs text-forge-bg-dark/60 mt-1">Estado del proyecto: <strong>entregado</strong> se muestra en "Proyectos terminados" y <strong>en-curso</strong> en "Proyectos en desarrollo".</p>
          <p className="text-xs text-forge-bg-dark/60 mt-1">Ordena proyectos arrastrando dentro de su misma columna de estado.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startAdd}
            disabled={editingIndex !== null}
            className="border rounded-lg px-3 py-2 text-sm hover:bg-forge-bg-light disabled:opacity-40"
          >
            Agregar proyecto
          </button>
          <button
            onClick={() => onSave(items)}
            disabled={saving || editingIndex !== null}
            className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}

      <div className="rounded-xl border border-forge-bg-dark/10 p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-forge-bg-dark">Contexto institucional de proyectos</h3>
            <p className="text-xs text-forge-bg-dark/60">Este bloque alimenta el caso de experiencia y el resumen de proyectos en progreso.</p>
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
          <label className="block text-sm font-semibold text-forge-bg-dark">Caso de experiencia - título</label>
          <input
            value={narrativeDraft.experience.title}
            onChange={(e) =>
              setNarrativeDraft((prev) => ({
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
            value={narrativeDraft.experience.description}
            onChange={(e) =>
              setNarrativeDraft((prev) => ({
                ...prev,
                experience: { ...prev.experience, description: e.target.value },
              }))
            }
            className="w-full min-h-[90px] border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <ImageUploadInput
          label="Caso de experiencia - imagen"
          value={narrativeDraft.experience.imageUrl || ''}
          folder="about"
          onChange={(next) =>
            setNarrativeDraft((prev) => ({
              ...prev,
              experience: { ...prev.experience, imageUrl: next },
            }))
          }
          placeholder="URL imagen (opcional)"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-forge-bg-dark">Caso de experiencia - items</h4>
            <button onClick={addExperienceItem} className="border rounded px-3 py-1 text-sm">Agregar item</button>
          </div>

          <div className="space-y-2">
            {narrativeDraft.experience.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...narrativeDraft.experience.items]
                    next[index] = e.target.value
                    setNarrativeDraft((prev) => ({
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
            <button onClick={addInProgressItem} className="border rounded px-3 py-1 text-sm">Agregar item</button>
          </div>

          <div className="space-y-2">
            {narrativeDraft.projectsInProgress.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...narrativeDraft.projectsInProgress]
                    next[index] = e.target.value
                    setNarrativeDraft((prev) => ({ ...prev, projectsInProgress: next }))
                  }}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <button onClick={() => removeInProgressItem(index)} className="border rounded px-3 py-2 text-sm text-red-600">Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-emerald-600/20 bg-emerald-50 px-3 py-2">
            <h3 className="text-sm font-semibold text-emerald-800">Proyectos entregados</h3>
            <span className="text-xs font-semibold text-emerald-700">{deliveredProjects.length}</span>
          </div>

          {deliveredProjects.map(({ project, index }) => {
            const isEditing = editingIndex === index
            const isOpen = isEditing || openProjectIndex === index
            const isDropTarget = dragOverProjectIndex === index && canDropOn(index)

            return (
              <div
                key={project.id}
                className={`rounded-xl border bg-white transition ${isDropTarget ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-forge-bg-dark/10'}`}
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
                    <p className="text-xs font-semibold text-forge-bg-dark/60">Proyecto #{index + 1}</p>
                    <p className="font-semibold text-forge-bg-dark">{project.title || 'Proyecto sin título'}</p>
                    <p className="text-xs text-forge-bg-dark/60">ID: {project.id}</p>
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
                      className={`text-xs rounded px-2 py-1 border ${editingIndex === null ? 'cursor-grab active:cursor-grabbing border-forge-bg-dark/20 text-forge-bg-dark/60' : 'border-forge-bg-dark/10 text-forge-bg-dark/30 cursor-not-allowed'}`}
                      title="Arrastra para reordenar"
                    >
                      Arrastrar
                    </span>
                    <span className="text-xs rounded-full px-2 py-1 bg-emerald-600/10 text-emerald-700 font-semibold">entregado</span>
                    <span className="text-forge-bg-dark/50 text-sm">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-forge-bg-dark/10">
                    {isEditing ? (
                      <ProjectForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
                    ) : (
                      <>
                        <p className="text-sm text-forge-blue-mid font-semibold mt-2">{project.sector}</p>
                        <p className="text-sm text-forge-bg-dark/70">{project.summary}</p>
                        <div className="text-xs text-forge-bg-dark/60">
                          <p>Imagen: {project.imageUrl || 'Sin imagen'}</p>
                          {project.externalUrl && <p>URL externa: {project.externalUrl}</p>}
                        </div>
                        <ul className="text-sm text-forge-bg-dark/75 list-disc pl-5">
                          {project.results.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => startEdit(index)} disabled={editingIndex !== null} className="border rounded px-2 py-1 text-sm disabled:opacity-40">Editar</button>
                          <button onClick={() => remove(index)} disabled={editingIndex !== null} className="border rounded px-2 py-1 text-sm text-red-600 disabled:opacity-40">Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {deliveredProjects.length === 0 && (
            <p className="text-xs text-forge-bg-dark/60">No hay proyectos entregados.</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-orange-500/20 bg-orange-50 px-3 py-2">
            <h3 className="text-sm font-semibold text-orange-800">Proyectos en curso</h3>
            <span className="text-xs font-semibold text-orange-700">{inProgressProjects.length}</span>
          </div>

          {inProgressProjects.map(({ project, index }) => {
            const isEditing = editingIndex === index
            const isOpen = isEditing || openProjectIndex === index
            const isDropTarget = dragOverProjectIndex === index && canDropOn(index)

            return (
              <div
                key={project.id}
                className={`rounded-xl border bg-white transition ${isDropTarget ? 'border-orange-500 ring-2 ring-orange-200' : 'border-forge-bg-dark/10'}`}
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
                    <p className="text-xs font-semibold text-forge-bg-dark/60">Proyecto #{index + 1}</p>
                    <p className="font-semibold text-forge-bg-dark">{project.title || 'Proyecto sin título'}</p>
                    <p className="text-xs text-forge-bg-dark/60">ID: {project.id}</p>
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
                      className={`text-xs rounded px-2 py-1 border ${editingIndex === null ? 'cursor-grab active:cursor-grabbing border-forge-bg-dark/20 text-forge-bg-dark/60' : 'border-forge-bg-dark/10 text-forge-bg-dark/30 cursor-not-allowed'}`}
                      title="Arrastra para reordenar"
                    >
                      Arrastrar
                    </span>
                    <span className="text-xs rounded-full px-2 py-1 bg-orange-500/10 text-orange-700 font-semibold">en-curso</span>
                    <span className="text-forge-bg-dark/50 text-sm">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-forge-bg-dark/10">
                    {isEditing ? (
                      <ProjectForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
                    ) : (
                      <>
                        <p className="text-sm text-forge-blue-mid font-semibold mt-2">{project.sector}</p>
                        <p className="text-sm text-forge-bg-dark/70">{project.summary}</p>
                        <div className="text-xs text-forge-bg-dark/60">
                          <p>Imagen: {project.imageUrl || 'Sin imagen'}</p>
                          {project.externalUrl && <p>URL externa: {project.externalUrl}</p>}
                        </div>
                        <ul className="text-sm text-forge-bg-dark/75 list-disc pl-5">
                          {project.results.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => startEdit(index)} disabled={editingIndex !== null} className="border rounded px-2 py-1 text-sm disabled:opacity-40">Editar</button>
                          <button onClick={() => remove(index)} disabled={editingIndex !== null} className="border rounded px-2 py-1 text-sm text-red-600 disabled:opacity-40">Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {inProgressProjects.length === 0 && (
            <p className="text-xs text-forge-bg-dark/60">No hay proyectos en curso.</p>
          )}
        </div>
      </div>

        {editingIndex === items.length && (
          <div className="rounded-xl border border-forge-bg-dark/10 p-4">
            <ProjectForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
          </div>
        )}

        {items.length === 0 && editingIndex === null && (
          <p className="text-sm text-forge-bg-dark/60 text-center py-4">No hay proyectos. Usa Agregar proyecto para crear el primero.</p>
        )}
    </section>
  )
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
        <input value={draft.id} onChange={(e) => onChange({ ...draft, id: e.target.value })} placeholder="id (ej: avc)" className="border rounded-lg px-3 py-2 text-sm" />
        <select value={draft.status} onChange={(e) => onChange({ ...draft, status: e.target.value as 'entregado' | 'en-curso' })} className="border rounded-lg px-3 py-2 text-sm">
          <option value="entregado">entregado</option>
          <option value="en-curso">en-curso</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={draft.title} onChange={(e) => onChange({ ...draft, title: e.target.value })} placeholder="Título" className="border rounded-lg px-3 py-2 text-sm" />
        <input value={draft.sector} onChange={(e) => onChange({ ...draft, sector: e.target.value })} placeholder="Sector" className="border rounded-lg px-3 py-2 text-sm" />
      </div>
      <textarea value={draft.summary} onChange={(e) => onChange({ ...draft, summary: e.target.value })} placeholder="Resumen" className="w-full border rounded-lg px-3 py-2 text-sm min-h-[90px]" />
      <ImageUploadInput
        label="Imagen del proyecto"
        value={draft.imageUrl}
        folder="projects"
        onChange={(next) => onChange({ ...draft, imageUrl: next })}
        placeholder="URL imagen (opcional)"
      />
      <input value={draft.externalUrl} onChange={(e) => onChange({ ...draft, externalUrl: e.target.value })} placeholder="URL externa (opcional)" className="w-full border rounded-lg px-3 py-2 text-sm" />
      <textarea value={draft.resultsText} onChange={(e) => onChange({ ...draft, resultsText: e.target.value })} placeholder="Resultados, uno por línea" className="w-full border rounded-lg px-3 py-2 text-sm min-h-[90px]" />
      <div className="flex gap-2">
        <button onClick={onConfirm} className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm">Confirmar</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </div>
  )
}
