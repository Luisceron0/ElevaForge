'use client'

import { useEffect, useState } from 'react'
import { FamiliaDeSolucion } from '@/lib/site-content'

interface Props {
  familias: FamiliaDeSolucion[]
  saving: boolean
  onSave: (familias: FamiliaDeSolucion[]) => void
}

interface FamiliaDraft {
  id: FamiliaDeSolucion['id']
  nombre: string
  descripcion: string
  solucionesText: string
  capacidadesText: string
}

function toDraft(item: FamiliaDeSolucion): FamiliaDraft {
  return {
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    solucionesText: item.soluciones.join('\n'),
    capacidadesText: item.capacidades.join('\n'),
  }
}

function toFamilia(draft: FamiliaDraft): FamiliaDeSolucion {
  return {
    id: draft.id,
    nombre: draft.nombre.trim(),
    descripcion: draft.descripcion.trim(),
    soluciones: draft.solucionesText.split('\n').map((line) => line.trim()).filter(Boolean),
    capacidades: draft.capacidadesText.split('\n').map((line) => line.trim()).filter(Boolean),
  }
}

function validate(draft: FamiliaDraft): string {
  if (!draft.nombre.trim()) return 'El nombre es obligatorio'
  if (!draft.descripcion.trim()) return 'La descripción es obligatoria'
  const soluciones = draft.solucionesText.split('\n').map((l) => l.trim()).filter(Boolean)
  if (soluciones.length === 0) return 'Debes listar al menos una solución (una por línea)'
  return ''
}

export default function SolucionesAdminEditor({ familias, saving, onSave }: Props) {
  const [items, setItems] = useState<FamiliaDeSolucion[]>(familias)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<FamiliaDraft | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setItems(familias)
  }, [familias])

  function startEdit(item: FamiliaDeSolucion) {
    setEditingId(item.id)
    setDraft(toDraft(item))
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(null)
    setError('')
  }

  function commitEdit() {
    if (!draft) return
    const validation = validate(draft)
    if (validation) {
      setError(validation)
      return
    }

    const nextItem = toFamilia(draft)
    setItems((prev) => prev.map((item) => (item.id === nextItem.id ? nextItem : item)))
    cancelEdit()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Familias de soluciones</h3>
          <p className="text-sm text-white/60 mt-0.5">
            Las 3 familias son fijas (no se agregan ni eliminan) — solo se edita su descripción y contenido. Sin precios.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSave(items)}
          disabled={saving || editingId !== null}
          className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-forge-orange-main/90 transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-500 bg-red-950 text-red-200 px-4 py-3 text-sm">{error}</div>}

      <div className="border border-white/10 rounded-xl p-4 space-y-3 bg-white/5">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 group hover:border-white/20 transition-colors">
            {editingId === item.id && draft ? (
              <FamiliaForm draft={draft} onChange={setDraft} onConfirm={commitEdit} onCancel={cancelEdit} />
            ) : (
              <>
                <div>
                  <p className="font-semibold text-white">{item.nombre}</p>
                  <p className="text-xs text-white/60">ID: {item.id}</p>
                  <p className="text-sm text-white/75 mt-2">{item.descripcion}</p>
                </div>
                <ul className="text-sm text-white/75 list-disc pl-5">
                  {item.soluciones.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {item.capacidades.length > 0 && (
                  <p className="text-xs text-white/50">Capacidades: {item.capacidades.join(', ')}</p>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(item)} disabled={editingId !== null} className="border border-white/20 rounded px-2 py-1 text-sm text-white hover:bg-white/10 disabled:opacity-40 transition-colors">Editar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface FormProps {
  draft: FamiliaDraft
  onChange: (next: FamiliaDraft) => void
  onConfirm: () => void
  onCancel: () => void
}

function FamiliaForm({ draft, onChange, onConfirm, onCancel }: FormProps) {
  return (
    <div className="space-y-3">
      <input value={draft.nombre} onChange={(e) => onChange({ ...draft, nombre: e.target.value })} placeholder="Nombre de la familia" className="w-full border rounded-lg px-3 py-2 text-sm" />
      <textarea value={draft.descripcion} onChange={(e) => onChange({ ...draft, descripcion: e.target.value })} placeholder="Descripción (problema → solución)" className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" />
      <div>
        <label className="text-xs text-white/60">Soluciones principales, una por línea</label>
        <textarea value={draft.solucionesText} onChange={(e) => onChange({ ...draft, solucionesText: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]" />
      </div>
      <div>
        <label className="text-xs text-white/60">Capacidades configurables, una por línea</label>
        <textarea value={draft.capacidadesText} onChange={(e) => onChange({ ...draft, capacidadesText: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]" />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onConfirm} className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm">Confirmar</button>
        <button type="button" onClick={onCancel} className="border px-4 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </div>
  )
}
