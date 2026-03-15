'use client'

import { useEffect, useState } from 'react'
import { ProjectItem } from '@/lib/site-content'
import ImageUploadInput from './ImageUploadInput'
import { isAssetRef } from '@/lib/asset-refs'

interface Props {
  projects: ProjectItem[]
  saving: boolean
  onSave: (projects: ProjectItem[]) => void
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

export default function ProjectsAdminEditor({ projects, saving, onSave }: Props) {
  const [items, setItems] = useState<ProjectItem[]>(projects)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<ProjectDraft>(EMPTY_DRAFT)
  const [error, setError] = useState('')

  useEffect(() => {
    setItems(projects)
  }, [projects])

  function startAdd() {
    setEditingIndex(items.length)
    setDraft(EMPTY_DRAFT)
    setError('')
  }

  function startEdit(index: number) {
    setEditingIndex(index)
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
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  return (
    <section className="bg-white rounded-2xl shadow p-5 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-forge-bg-dark">Proyectos</h2>
          <p className="text-sm text-forge-bg-dark/70">Editor visual: agrega, ordena y modifica proyectos sin JSON.</p>
          <p className="text-xs text-forge-bg-dark/60 mt-1">Estado del proyecto: <strong>entregado</strong> se muestra en "Proyectos terminados" y <strong>en-curso</strong> en "Proyectos en desarrollo".</p>
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

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-forge-bg-dark/10 p-4 space-y-3">
            {editingIndex === index ? (
              <ProjectForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-forge-bg-dark">{item.title}</p>
                    <p className="text-xs text-forge-bg-dark/60">ID: {item.id}</p>
                    <p className="text-sm text-forge-blue-mid font-semibold mt-1">{item.sector}</p>
                    <p className="text-sm text-forge-bg-dark/70 mt-2">{item.summary}</p>
                  </div>
                  <span className="text-xs rounded-full px-2 py-1 bg-forge-orange-main/10 text-forge-orange-main font-semibold">
                    {item.status}
                  </span>
                </div>
                <div className="text-xs text-forge-bg-dark/60">
                  <p>Imagen: {item.imageUrl || 'Sin imagen'}</p>
                  {item.externalUrl && <p>URL externa: {item.externalUrl}</p>}
                </div>
                <ul className="text-sm text-forge-bg-dark/75 list-disc pl-5">
                  {item.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button onClick={() => move(index, -1)} disabled={index === 0 || editingIndex !== null} className="border rounded px-2 py-1 text-sm disabled:opacity-40">Subir</button>
                  <button onClick={() => move(index, 1)} disabled={index === items.length - 1 || editingIndex !== null} className="border rounded px-2 py-1 text-sm disabled:opacity-40">Bajar</button>
                  <button onClick={() => startEdit(index)} disabled={editingIndex !== null} className="border rounded px-2 py-1 text-sm disabled:opacity-40">Editar</button>
                  <button onClick={() => remove(index)} disabled={editingIndex !== null} className="border rounded px-2 py-1 text-sm text-red-600 disabled:opacity-40">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}

        {editingIndex === items.length && (
          <div className="rounded-xl border border-forge-bg-dark/10 p-4">
            <ProjectForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
          </div>
        )}

        {items.length === 0 && editingIndex === null && (
          <p className="text-sm text-forge-bg-dark/60 text-center py-4">No hay proyectos. Usa Agregar proyecto para crear el primero.</p>
        )}
      </div>
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
