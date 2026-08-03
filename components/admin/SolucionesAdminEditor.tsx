'use client'

import { useEffect, useState } from 'react'
import { FamiliaDeSolucion, SolucionItem } from '@/lib/site-content'
import { isSafeExternalUrl } from '@/lib/safe-url'
import EntityListEditor from './EntityListEditor'

interface Props {
  familias: FamiliaDeSolucion[]
  saving: boolean
  onSave: (familias: FamiliaDeSolucion[]) => void
}

interface FamiliaDraft {
  id: FamiliaDeSolucion['id']
  nombre: string
  descripcion: string
  soluciones: SolucionItem[]
  capacidadesText: string
}

function toDraft(item: FamiliaDeSolucion): FamiliaDraft {
  return {
    id: item.id,
    nombre: item.nombre,
    descripcion: item.descripcion,
    soluciones: item.soluciones,
    capacidadesText: item.capacidades.join('\n'),
  }
}

function toFamilia(draft: FamiliaDraft): FamiliaDeSolucion {
  return {
    id: draft.id,
    nombre: draft.nombre.trim(),
    descripcion: draft.descripcion.trim(),
    soluciones: draft.soluciones
      .map((s) => ({
        nombre: s.nombre.trim(),
        descripcion: s.descripcion.trim(),
        // Sin demo se manda undefined (no ''), para no persistir claves
        // vacías en el jsonb.
        demoUrl: s.demoUrl?.trim() || undefined,
      }))
      .filter((s) => s.nombre),
    capacidades: draft.capacidadesText.split('\n').map((line) => line.trim()).filter(Boolean),
  }
}

// Límites en sincronía con familiaSchema en lib/admin-content-validation.ts
// (nombre familia/solución/capacidad: 120 c/u, descripcion familia: 600,
// descripcion solución: 400) — validar acá evita que el usuario descubra el
// límite recién al hacer clic en "Guardar", con un error de zod técnico que
// ni identifica la familia.
const NOMBRE_MAX = 120
const DESCRIPCION_MAX = 600
const SOLUCION_NOMBRE_MAX = 120
const SOLUCION_DESCRIPCION_MAX = 400
const SOLUCION_DEMO_URL_MAX = 300
const ITEM_MAX = 120

function validate(draft: FamiliaDraft): string {
  if (!draft.nombre.trim()) return 'El nombre es obligatorio'
  if (draft.nombre.length > NOMBRE_MAX) return `El nombre supera ${NOMBRE_MAX} caracteres`
  if (!draft.descripcion.trim()) return 'La descripción es obligatoria'
  if (draft.descripcion.length > DESCRIPCION_MAX) return `La descripción supera ${DESCRIPCION_MAX} caracteres (tiene ${draft.descripcion.length})`
  const soluciones = draft.soluciones.filter((s) => s.nombre.trim())
  if (soluciones.length === 0) return 'Debes agregar al menos una solución'
  const longNombre = soluciones.find((s) => s.nombre.length > SOLUCION_NOMBRE_MAX)
  if (longNombre) return `El nombre de una solución supera ${SOLUCION_NOMBRE_MAX} caracteres: "${longNombre.nombre.slice(0, 40)}..."`
  // Mismo criterio que el schema del servidor (lib/admin-content-validation.ts):
  // solo http(s). Se avisa acá para no descubrirlo recién en el 400 de la API.
  const badDemo = soluciones.find((s) => s.demoUrl?.trim() && !isSafeExternalUrl(s.demoUrl))
  if (badDemo) return `El demo de "${badDemo.nombre}" debe ser una URL completa que empiece con https:// (recibido: "${badDemo.demoUrl?.slice(0, 40)}")`
  const longDemo = soluciones.find((s) => (s.demoUrl?.length ?? 0) > SOLUCION_DEMO_URL_MAX)
  if (longDemo) return `La URL de demo de "${longDemo.nombre}" supera ${SOLUCION_DEMO_URL_MAX} caracteres`
  const capacidades = draft.capacidadesText.split('\n').map((l) => l.trim()).filter(Boolean)
  const longCapacidad = capacidades.find((c) => c.length > ITEM_MAX)
  if (longCapacidad) return `Esta capacidad supera ${ITEM_MAX} caracteres: "${longCapacidad.slice(0, 40)}..."`
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
                    <li key={s.nombre}>
                      {s.nombre}
                      {s.descripcion && <span className="text-white/50"> — {s.descripcion}</span>}
                      {s.demoUrl && <span className="block text-xs text-forge-orange-main break-all">Demo: {s.demoUrl}</span>}
                    </li>
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
  const capacidadesLines = draft.capacidadesText.split('\n').map((l) => l.trim()).filter(Boolean)
  const longestCapacidad = Math.max(0, ...capacidadesLines.map((c) => c.length))

  function addSolucion() {
    onChange({ ...draft, soluciones: [...draft.soluciones, { nombre: '', descripcion: '', demoUrl: '' }] })
  }

  function removeSolucion(index: number) {
    onChange({ ...draft, soluciones: draft.soluciones.filter((_, i) => i !== index) })
  }

  function changeSoluciones(entities: { title: string; description: string; extra?: string }[]) {
    onChange({
      ...draft,
      soluciones: entities.map((e) => ({ nombre: e.title, descripcion: e.description, demoUrl: e.extra ?? '' })),
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <input value={draft.nombre} onChange={(e) => onChange({ ...draft, nombre: e.target.value })} maxLength={NOMBRE_MAX} placeholder="Nombre de la familia" className="w-full border rounded-lg px-3 py-2 text-sm" />
        <p className="text-xs text-white/40 mt-1 text-right">{draft.nombre.length}/{NOMBRE_MAX}</p>
      </div>
      <div>
        <textarea value={draft.descripcion} onChange={(e) => onChange({ ...draft, descripcion: e.target.value })} maxLength={DESCRIPCION_MAX} placeholder="Descripción (problema → solución)" className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" />
        <p className={`text-xs mt-1 text-right ${draft.descripcion.length > DESCRIPCION_MAX * 0.9 ? 'text-amber-400' : 'text-white/40'}`}>{draft.descripcion.length}/{DESCRIPCION_MAX}</p>
      </div>

      <EntityListEditor
        title="Soluciones principales"
        items={draft.soluciones.map((s) => ({ title: s.nombre, description: s.descripcion, extra: s.demoUrl ?? '' }))}
        onAdd={addSolucion}
        onRemove={removeSolucion}
        onChange={changeSoluciones}
        titleLabel="Nombre de la solución"
        descriptionLabel="Descripción (opcional)"
        titlePlaceholder="Ej: Landing Page"
        descriptionPlaceholder="Describe brevemente en qué consiste esta solución..."
        titleMaxLength={SOLUCION_NOMBRE_MAX}
        descriptionMaxLength={SOLUCION_DESCRIPCION_MAX}
        extraLabel="Demo público (opcional)"
        extraPlaceholder="https://demo.elevaforge.com"
        extraMaxLength={SOLUCION_DEMO_URL_MAX}
        extraHelp="Si se completa, aparece como botón 'Ver demo' en la home. Solo URLs https:// completas."
        extraType="url"
      />

      <div>
        <label className="text-xs text-white/60">Capacidades configurables, una por línea (máx. {ITEM_MAX} caracteres c/u)</label>
        <textarea value={draft.capacidadesText} onChange={(e) => onChange({ ...draft, capacidadesText: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[100px]" />
        {longestCapacidad > ITEM_MAX && <p className="text-xs text-amber-400 mt-1">Hay una línea de {longestCapacidad} caracteres (máx. {ITEM_MAX})</p>}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onConfirm} className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm">Confirmar</button>
        <button type="button" onClick={onCancel} className="border px-4 py-2 rounded-lg text-sm">Cancelar</button>
      </div>
    </div>
  )
}
