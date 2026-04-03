'use client'

import { useState } from 'react'
import { TeamCapability } from '@/lib/site-content'
import ImageUploadInput from './ImageUploadInput'
import { extractStoragePath } from '@/lib/asset-refs'

/** Paleta de colores — debe coincidir con TeamSection.tsx */
const AVATAR_PALETTES = [
  { from: '#F97300', to: '#FBA81E', text: '#19192E' },
  { from: '#3185C5', to: '#49ACED', text: '#ffffff' },
  { from: '#174166', to: '#306A9C', text: '#ffffff' },
  { from: '#F97300', to: '#3185C5', text: '#ffffff' },
]

function MiniPreview({ member, index }: { member: TeamCapability; index: number }) {
  const p = AVATAR_PALETTES[index % AVATAR_PALETTES.length]
  const initials = (member.owner || '??').slice(0, 2).toUpperCase()
  const previewSrc = getAdminPreviewSrc(member.imageUrl)
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1F1F3A] px-3 py-2">
      {previewSrc ? (
        <img src={previewSrc} alt={member.owner || 'Miembro del equipo'} className="h-9 w-9 flex-shrink-0 rounded-lg object-cover" />
      ) : (
        <div
          className="h-9 w-9 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: `linear-gradient(135deg,${p.from},${p.to})`, color: p.text }}
        >
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate">{member.owner || 'Sin nombre'}</p>
        <p className="text-xs text-white/50 truncate">{member.area || 'Sin área'}</p>
      </div>
    </div>
  )
}

const EMPTY_MEMBER: TeamCapability = { owner: '', area: '', description: '', imageUrl: '' }

interface Props {
  team: TeamCapability[]
  saving: boolean
  onSave: (team: TeamCapability[]) => void
}

export default function TeamAdminEditor({ team, saving, onSave }: Props) {
  const [members, setMembers] = useState<TeamCapability[]>(team)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<TeamCapability>(EMPTY_MEMBER)
  const [errors, setErrors] = useState<Partial<TeamCapability>>({})

  function validate(m: TeamCapability): Partial<TeamCapability> {
    const e: Partial<TeamCapability> = {}
    if (!m.owner.trim()) e.owner = 'El nombre es obligatorio'
    if (!m.area.trim()) e.area = 'El área es obligatoria'
    if (!m.description.trim()) e.description = 'La descripción es obligatoria'
    return e
  }

  function startAdd() {
    setDraft({ ...EMPTY_MEMBER })
    setErrors({})
    setEditingIndex(members.length) // index que no existe aún → modo "nuevo"
  }

  function startEdit(i: number) {
    setDraft({ ...members[i] })
    setErrors({})
    setEditingIndex(i)
  }

  function cancelEdit() {
    setEditingIndex(null)
    setErrors({})
  }

  function commitEdit() {
    const e = validate(draft)
    if (Object.keys(e).length) { setErrors(e); return }

    setMembers((prev) => {
      const next = [...prev]
      if (editingIndex! < prev.length) {
        next[editingIndex!] = { ...draft }
      } else {
        next.push({ ...draft })
      }
      return next
    })
    setEditingIndex(null)
    setErrors({})
  }

  function remove(i: number) {
    if (!window.confirm('¿Eliminar este miembro del equipo?')) return
    setMembers((prev) => prev.filter((_, idx) => idx !== i))
    if (editingIndex === i) setEditingIndex(null)
  }

  function moveUp(i: number) {
    if (i === 0) return
    setMembers((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next
    })
  }

  function moveDown(i: number) {
    if (i === members.length - 1) return
    setMembers((prev) => {
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next
    })
  }

  const isAdding = editingIndex === members.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Equipo</h3>
          <p className="text-sm text-white/60 mt-0.5">Gestiona los miembros de la sección &quot;Quiénes somos&quot;</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startAdd}
            disabled={editingIndex !== null}
            className="flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-white/10 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar miembro
          </button>
          <button
            type="button"
            onClick={() => onSave(members)}
            disabled={saving || editingIndex !== null}
            className="bg-forge-orange-main text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-forge-orange-main/90 transition-colors"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Lista de miembros */}
      <div className="border border-white/10 rounded-xl p-4 bg-white/5">
        {members.length === 0 && editingIndex === null && (
          <p className="text-sm text-white/50 py-6 text-center">
            No hay miembros. Haz clic en &quot;Agregar miembro&quot; para comenzar.
          </p>
        )}

        <div className="space-y-3">
        {members.map((m, i) => (
          <div key={i}>
            {/* Fila de miembro (no en edición) */}
            {editingIndex !== i && (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 group hover:border-white/20 transition-colors">
                {/* Mini preview */}
                <div className="flex-1 min-w-0">
                  <MiniPreview member={m} index={i} />
                </div>
                <p className="hidden sm:block text-sm text-white/60 line-clamp-1 flex-1 min-w-0">
                  {m.description}
                </p>
                {/* Acciones */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0 || editingIndex !== null}
                    aria-label="Subir"
                    className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                  >
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === members.length - 1 || editingIndex !== null}
                    aria-label="Bajar"
                    className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                  >
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(i)}
                    disabled={editingIndex !== null}
                    aria-label="Editar"
                    className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                  >
                    <svg className="h-4 w-4 text-forge-blue-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    disabled={editingIndex !== null}
                    aria-label="Eliminar"
                    className="p-1.5 rounded-lg hover:bg-red-900/20 disabled:opacity-30 transition-colors"
                  >
                    <svg className="h-4 w-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Formulario inline de edición */}
            {editingIndex === i && (
              <MemberForm
                draft={draft}
                errors={errors}
                index={i}
                onChange={setDraft}
                onSave={commitEdit}
                onCancel={cancelEdit}
              />
            )}
          </div>
        ))}

        {/* Formulario de nuevo miembro al final */}
        {isAdding && (
          <MemberForm
            draft={draft}
            errors={errors}
            index={members.length}
            onChange={setDraft}
            onSave={commitEdit}
            onCancel={cancelEdit}
          />
        )}
        </div>
      </div>
    </div>
  )
}

/* ─── Formulario inline de edición / creación ─────────────────── */
interface FormProps {
  draft: TeamCapability
  errors: Partial<TeamCapability>
  index: number
  onChange: (m: TeamCapability) => void
  onSave: () => void
  onCancel: () => void
}

function MemberForm({ draft, errors, index, onChange, onSave, onCancel }: FormProps) {
  const p = AVATAR_PALETTES[index % AVATAR_PALETTES.length]
  const initials = (draft.owner || '??').slice(0, 2).toUpperCase()
  const previewSrc = getAdminPreviewSrc(draft.imageUrl)

  return (
    <div className="rounded-2xl border-2 border-forge-orange-main/30 bg-forge-bg-dark p-5 space-y-4">
      {/* Mini preview en tiempo real */}
      <div className="flex items-center gap-3">
        {previewSrc ? (
          <img src={previewSrc} alt={draft.owner || 'Miembro del equipo'} className="h-12 w-12 flex-shrink-0 rounded-xl object-cover" />
        ) : (
          <div
            className="h-12 w-12 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: `linear-gradient(135deg,${p.from},${p.to})`, color: p.text }}
          >
            {initials}
          </div>
        )}
        <div>
          <p className="text-white font-semibold">{draft.owner || <span className="opacity-40">Nombre</span>}</p>
          <p className="text-xs text-white/50">{draft.area || <span className="opacity-40">Área</span>}</p>
        </div>
      </div>

      {/* Campos */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1">Nombre *</label>
          <input
            type="text"
            maxLength={60}
            value={draft.owner}
            onChange={(e) => onChange({ ...draft, owner: e.target.value })}
            placeholder="Ej: Luis"
            className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange-main"
          />
          {errors.owner && <p className="text-red-400 text-xs mt-1">{errors.owner}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/70 mb-1">Área *</label>
          <input
            type="text"
            maxLength={80}
            value={draft.area}
            onChange={(e) => onChange({ ...draft, area: e.target.value })}
            placeholder="Ej: Arquitectura y Seguridad"
            className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange-main"
          />
          {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area}</p>}
        </div>
      </div>
      <ImageUploadInput
        label="Foto del miembro"
        value={draft.imageUrl || ''}
        folder="members"
        onChange={(next) => onChange({ ...draft, imageUrl: next })}
        placeholder="URL de foto (opcional)"
      />
      <div>
        <label className="block text-xs font-semibold text-white/70 mb-1">Descripción *</label>
        <textarea
          rows={3}
          maxLength={300}
          value={draft.description}
          onChange={(e) => onChange({ ...draft, description: e.target.value })}
          placeholder="Describe las responsabilidades y especialidades de este miembro..."
          className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forge-orange-main resize-none"
        />
        <p className="text-xs text-white/30 text-right mt-0.5">{draft.description.length}/300</p>
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Botones */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onSave}
          className="flex-1 bg-forge-orange-main text-white py-2 rounded-lg text-sm font-semibold hover:bg-forge-orange-gold transition-colors"
        >
          Confirmar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-white/20 text-white/70 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

function getAdminPreviewSrc(value: string | undefined): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  if (extractStoragePath(raw)) {
    return `/api/admin/uploads/preview?ref=${encodeURIComponent(raw)}`
  }
  return raw
}
