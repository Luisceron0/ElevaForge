'use client'

/**
 * Shared title+description list editor (add/remove/edit inline). Originally
 * lived only inside AboutAdminEditor (used for "Fases"/"Pilares"); extracted
 * so SolucionesAdminEditor can reuse it for per-solución descriptions instead
 * of duplicating the same add/remove/edit UI.
 */
export interface Entity {
  title: string
  description: string
  /** Campo opcional extra (una línea). Solo se edita si se pasa `extraLabel`. */
  extra?: string
  /** Campo opcional extra (multilínea). Solo se edita si se pasa `extra2Label`. */
  extra2?: string
}

interface EntityListEditorProps {
  title: string
  items: Entity[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (items: Entity[]) => void
  showTitle?: boolean
  titleLabel?: string
  descriptionLabel?: string
  titlePlaceholder?: string
  descriptionPlaceholder?: string
  titleMaxLength?: number
  descriptionMaxLength?: number
  /** Activa el tercer campo (input de una línea) por ítem. */
  extraLabel?: string
  extraPlaceholder?: string
  extraMaxLength?: number
  extraHelp?: string
  extraType?: 'text' | 'url'
  /** Activa el cuarto campo (textarea multilínea) por ítem. */
  extra2Label?: string
  extra2Placeholder?: string
  extra2MaxLength?: number
  extra2Help?: string
}

export default function EntityListEditor({
  title,
  items,
  onAdd,
  onRemove,
  onChange,
  showTitle = true,
  titleLabel = 'Título',
  descriptionLabel = 'Descripción',
  titlePlaceholder = 'Ej: Análisis Completo',
  descriptionPlaceholder = 'Describe esta fase o pilar...',
  titleMaxLength,
  descriptionMaxLength,
  extraLabel,
  extraPlaceholder,
  extraMaxLength,
  extraHelp,
  extraType = 'text',
  extra2Label,
  extra2Placeholder,
  extra2MaxLength,
  extra2Help,
}: EntityListEditorProps) {
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
                <label className="text-xs font-semibold text-white/70 block mb-2">{titleLabel}</label>
                <input
                  value={item.title}
                  maxLength={titleMaxLength}
                  onChange={(e) => {
                    const next = [...items]
                    next[index] = { ...next[index], title: e.target.value }
                    onChange(next)
                  }}
                  placeholder={titlePlaceholder}
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
                />
                {titleMaxLength && <p className="text-xs text-white/40 mt-1 text-right">{item.title.length}/{titleMaxLength}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-2">{descriptionLabel}</label>
                <textarea
                  value={item.description}
                  maxLength={descriptionMaxLength}
                  onChange={(e) => {
                    const next = [...items]
                    next[index] = { ...next[index], description: e.target.value }
                    onChange(next)
                  }}
                  placeholder={descriptionPlaceholder}
                  className="w-full min-h-[100px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none"
                />
                {descriptionMaxLength && <p className="text-xs text-white/40 mt-1 text-right">{item.description.length}/{descriptionMaxLength}</p>}
              </div>
              {extraLabel && (
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-2">{extraLabel}</label>
                  <input
                    type={extraType}
                    value={item.extra ?? ''}
                    maxLength={extraMaxLength}
                    onChange={(e) => {
                      const next = [...items]
                      next[index] = { ...next[index], extra: e.target.value }
                      onChange(next)
                    }}
                    placeholder={extraPlaceholder}
                    className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
                  />
                  {extraHelp && <p className="text-xs text-white/40 mt-1">{extraHelp}</p>}
                </div>
              )}
              {extra2Label && (
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-2">{extra2Label}</label>
                  <textarea
                    value={item.extra2 ?? ''}
                    maxLength={extra2MaxLength}
                    onChange={(e) => {
                      const next = [...items]
                      next[index] = { ...next[index], extra2: e.target.value }
                      onChange(next)
                    }}
                    placeholder={extra2Placeholder}
                    className="w-full min-h-[100px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none"
                  />
                  <div className="flex items-center justify-between mt-1">
                    {extra2Help && <p className="text-xs text-white/40">{extra2Help}</p>}
                    {extra2MaxLength && <p className="text-xs text-white/40 shrink-0">{(item.extra2 ?? '').length}/{extra2MaxLength}</p>}
                  </div>
                </div>
              )}
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
