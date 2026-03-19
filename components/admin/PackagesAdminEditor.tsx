'use client'

import { useEffect, useState } from 'react'
import { PackagePlan } from '@/lib/site-content'

interface Props {
  plans: PackagePlan[]
  saving: boolean
  onSave: (plans: PackagePlan[]) => void
}

interface PackageDraft {
  id: string
  title: string
  priceUsd: string
  priceCop: string
  bulletsText: string
}

const EMPTY_DRAFT: PackageDraft = {
  id: '',
  title: '',
  priceUsd: '',
  priceCop: '',
  bulletsText: '',
}

function toDraft(item: PackagePlan): PackageDraft {
  return {
    id: item.id,
    title: item.title,
    priceUsd: String(item.priceUsd),
    priceCop: String(item.priceCop),
    bulletsText: item.bullets.join('\n'),
  }
}

function toPlan(draft: PackageDraft): PackagePlan {
  const bullets = draft.bulletsText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    id: draft.id.trim(),
    title: draft.title.trim(),
    priceUsd: Number(draft.priceUsd || 0),
    priceCop: Number(draft.priceCop || 0),
    bullets,
  }
}

function validate(draft: PackageDraft, plans: PackagePlan[], editingIndex: number | null): string {
  const p = toPlan(draft)

  if (!p.id || !/^[a-z0-9-]+$/i.test(p.id)) return 'El ID es obligatorio (solo letras, números y guion)'
  if (!p.title) return 'El título es obligatorio'
  if (!Number.isFinite(p.priceUsd) || p.priceUsd < 0) return 'El precio USD debe ser un número mayor o igual a 0'
  if (!Number.isFinite(p.priceCop) || p.priceCop < 0) return 'El precio COP debe ser un número mayor o igual a 0'
  if (p.bullets.length === 0) return 'Debes agregar al menos un bullet (una línea por bullet)'

  const duplicate = plans.findIndex((x, idx) => x.id.toLowerCase() === p.id.toLowerCase() && idx !== editingIndex)
  if (duplicate >= 0) return 'El ID ya existe en otro paquete'

  return ''
}

export default function PackagesAdminEditor({ plans, saving, onSave }: Props) {
  const [items, setItems] = useState<PackagePlan[]>(plans)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<PackageDraft>(EMPTY_DRAFT)
  const [error, setError] = useState('')

  useEffect(() => {
    setItems(plans)
  }, [plans])

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

    const nextItem = toPlan(draft)
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
    if (!window.confirm('¿Eliminar este paquete?')) return
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Paquetes y precios</h3>
          <p className="text-sm text-white/60 mt-0.5">Editor visual de planes, precios y características</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startAdd}
            disabled={editingIndex !== null}
            className="border border-white/20 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10 disabled:opacity-40 transition-colors text-white"
          >
            + Paquete
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

      <div className="border border-white/10 rounded-xl p-4 space-y-3 bg-white/5">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 group hover:border-white/20 transition-colors">
            {editingIndex === index ? (
              <PackageForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
            ) : (
              <>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/60">ID: {item.id}</p>
                  <p className="text-sm text-forge-orange-main font-semibold mt-1">USD ${item.priceUsd} | COP ${item.priceCop.toLocaleString()}</p>
                </div>
                <ul className="text-sm text-white/75 list-disc pl-5">
                  {item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button onClick={() => move(index, -1)} disabled={index === 0 || editingIndex !== null} className="border border-white/20 rounded px-2 py-1 text-sm text-white hover:bg-white/10 disabled:opacity-40 transition-colors">Subir</button>
                  <button onClick={() => move(index, 1)} disabled={index === items.length - 1 || editingIndex !== null} className="border border-white/20 rounded px-2 py-1 text-sm text-white hover:bg-white/10 disabled:opacity-40 transition-colors">Bajar</button>
                  <button onClick={() => startEdit(index)} disabled={editingIndex !== null} className="border border-white/20 rounded px-2 py-1 text-sm text-white hover:bg-white/10 disabled:opacity-40 transition-colors">Editar</button>
                  <button onClick={() => remove(index)} disabled={editingIndex !== null} className="border border-red-500/50 rounded px-2 py-1 text-sm text-red-300 hover:bg-red-900/20 disabled:opacity-40 transition-colors">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}

        {editingIndex === items.length && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <PackageForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
          </div>
        )}

        {items.length === 0 && editingIndex === null && (
          <p className="text-sm text-white/60 text-center py-6">No hay paquetes. Usa Agregar paquete para crear el primero.</p>
        )}
      </div>
    </div>
  )
}

interface FormProps {
  draft: PackageDraft
  onChange: (next: PackageDraft) => void
  onConfirm: () => void
  onCancel: () => void
}

function PackageForm({ draft, onChange, onConfirm, onCancel }: FormProps) {
  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={draft.id} onChange={(e) => onChange({ ...draft, id: e.target.value })} placeholder="id (ej: web)" className="border rounded-lg px-3 py-2 text-sm" />
        <input value={draft.title} onChange={(e) => onChange({ ...draft, title: e.target.value })} placeholder="Título" className="border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input type="number" min="0" value={draft.priceUsd} onChange={(e) => onChange({ ...draft, priceUsd: e.target.value })} placeholder="Precio USD" className="border rounded-lg px-3 py-2 text-sm" />
        <input type="number" min="0" value={draft.priceCop} onChange={(e) => onChange({ ...draft, priceCop: e.target.value })} placeholder="Precio COP" className="border rounded-lg px-3 py-2 text-sm" />
      </div>
      <textarea value={draft.bulletsText} onChange={(e) => onChange({ ...draft, bulletsText: e.target.value })} placeholder="Bullets, uno por línea" className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]" />
      <div className="flex gap-2">
        <button onClick={onConfirm} className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm">Confirmar</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </div>
  )
}
