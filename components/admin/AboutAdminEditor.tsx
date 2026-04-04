'use client'

import { useEffect, useState } from 'react'
import { AboutContent, DEFAULT_ABOUT } from '@/lib/site-content'

interface Props {
  about: AboutContent
  saving: boolean
  onSave: (about: AboutContent) => void
}

type TabType = 'intro' | 'home' | 'fases' | 'pilares' | 'lighthouse' | 'soporte'

const SUPPORT_CARD_TITLES = [
  'Propiedad del código',
  'Capacitación real',
  'WhatsApp sin intermediarios',
  'Autonomía operativa',
]

const SUPPORT_CARD_BADGES = [
  '100% tuya',
  'Manual PDF + Video',
  'Soporte directo',
  'Sin dependencia',
]

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

  const tabs = [
    { id: 'intro' as TabType, label: '📋 Introducción', icon: '📋' },
    { id: 'home' as TabType, label: '🏠 Home', icon: '🏠' },
    { id: 'fases' as TabType, label: '📊 Fases', icon: '📊' },
    { id: 'pilares' as TabType, label: '🎯 Pilares', icon: '🎯' },
    { id: 'lighthouse' as TabType, label: '📈 Lighthouse', icon: '📈' },
    { id: 'soporte' as TabType, label: '📌 Autonomía', icon: '📌' },
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
              <label className="block text-sm font-semibold text-white mb-3">Subtítulo del Hero (Home)</label>
              <p className="text-xs text-white/60 mb-3">Texto bajo el H1 principal en la portada.</p>
              <textarea
                value={draft.heroSubtitle}
                onChange={(e) => setDraft((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                placeholder="Describe la propuesta de valor principal de ElevaForge..."
                className="w-full min-h-[120px] border border-white/20 rounded-lg px-4 py-3 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none"
              />
              <p className="text-xs text-white/40 mt-2">{draft.heroSubtitle.length} caracteres</p>
            </div>

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

        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in-50">
            <h4 className="font-semibold text-white">Textos de secciones en Home</h4>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-sm font-semibold text-white">Hero</p>
              <input value={draft.homeContent.hero.badge} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, hero: { ...prev.homeContent.hero, badge: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Badge" />
              <input value={draft.homeContent.hero.title} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, hero: { ...prev.homeContent.hero, title: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Título principal" />
              <input value={draft.homeContent.hero.highlight} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, hero: { ...prev.homeContent.hero, highlight: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Texto destacado" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={draft.homeContent.hero.primaryCta} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, hero: { ...prev.homeContent.hero, primaryCta: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="CTA primario" />
                <input value={draft.homeContent.hero.secondaryCta} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, hero: { ...prev.homeContent.hero, secondaryCta: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="CTA secundario" />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-sm font-semibold text-white">Proyectos</p>
              <input value={draft.homeContent.projects.eyebrow} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, projects: { ...prev.homeContent.projects, eyebrow: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Eyebrow" />
              <input value={draft.homeContent.projects.title} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, projects: { ...prev.homeContent.projects, title: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Título" />
              <textarea value={draft.homeContent.projects.description} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, projects: { ...prev.homeContent.projects, description: e.target.value } } }))} className="w-full min-h-[80px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white resize-none" placeholder="Descripción" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={draft.homeContent.projects.deliveredLabel} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, projects: { ...prev.homeContent.projects, deliveredLabel: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Label entregados" />
                <input value={draft.homeContent.projects.inProgressLabel} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, projects: { ...prev.homeContent.projects, inProgressLabel: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Label en curso" />
              </div>
              <input value={draft.homeContent.projects.notesTitle} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, projects: { ...prev.homeContent.projects, notesTitle: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Título bloque de seguimiento" />
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-sm font-semibold text-white">Precios</p>
              <input value={draft.homeContent.pricing.eyebrow} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, pricing: { ...prev.homeContent.pricing, eyebrow: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Eyebrow" />
              <input value={draft.homeContent.pricing.title} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, pricing: { ...prev.homeContent.pricing, title: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Título" />
              <textarea value={draft.homeContent.pricing.description} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, pricing: { ...prev.homeContent.pricing, description: e.target.value } } }))} className="w-full min-h-[80px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white resize-none" placeholder="Descripción" />
              <textarea value={draft.homeContent.pricing.legalNote} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, pricing: { ...prev.homeContent.pricing, legalNote: e.target.value } } }))} className="w-full min-h-[70px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white resize-none" placeholder="Nota legal" />
              <input value={draft.homeContent.pricing.ctaLabel} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, pricing: { ...prev.homeContent.pricing, ctaLabel: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Texto CTA" />
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-sm font-semibold text-white">Roadmap</p>
              <input value={draft.homeContent.roadmap.eyebrow} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, roadmap: { ...prev.homeContent.roadmap, eyebrow: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Eyebrow" />
              <input value={draft.homeContent.roadmap.title} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, roadmap: { ...prev.homeContent.roadmap, title: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Título" />
              <textarea value={draft.homeContent.roadmap.description} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, roadmap: { ...prev.homeContent.roadmap, description: e.target.value } } }))} className="w-full min-h-[80px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white resize-none" placeholder="Descripción" />
              <input value={draft.homeContent.roadmap.ctaTitle} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, roadmap: { ...prev.homeContent.roadmap, ctaTitle: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Título CTA" />
              <input value={draft.homeContent.roadmap.ctaButton} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, roadmap: { ...prev.homeContent.roadmap, ctaButton: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Texto botón CTA" />
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-sm font-semibold text-white">Autonomía</p>
              <input value={draft.homeContent.autonomy.eyebrow} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, autonomy: { ...prev.homeContent.autonomy, eyebrow: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Eyebrow" />
              <input value={draft.homeContent.autonomy.title} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, autonomy: { ...prev.homeContent.autonomy, title: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Título" />
              <textarea value={draft.homeContent.autonomy.description} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, autonomy: { ...prev.homeContent.autonomy, description: e.target.value } } }))} className="w-full min-h-[70px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white resize-none" placeholder="Descripción" />
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-sm font-semibold text-white">Contacto</p>
              <input value={draft.homeContent.contact.title} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, contact: { ...prev.homeContent.contact, title: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Título" />
              <textarea value={draft.homeContent.contact.description} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, contact: { ...prev.homeContent.contact, description: e.target.value } } }))} className="w-full min-h-[70px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white resize-none" placeholder="Descripción" />
              <input value={draft.homeContent.contact.responseTime} onChange={(e) => setDraft((prev) => ({ ...prev, homeContent: { ...prev.homeContent, contact: { ...prev.homeContent.contact, responseTime: e.target.value } } }))} className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white" placeholder="Tiempo de respuesta" />
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

        {/* Tab: Lighthouse */}
        {activeTab === 'lighthouse' && (
          <div className="space-y-6 animate-in fade-in-50">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Performance */}
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <label className="block text-sm font-semibold text-white mb-3">Performance</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.lighthouse.performance?.score ?? 0}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      lighthouse: {
                        ...prev.lighthouse,
                        performance: {
                          ...prev.lighthouse.performance,
                          score: Number(e.target.value || 0),
                        },
                      },
                    }))
                  }
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 mb-3"
                />
                <textarea
                  value={draft.lighthouse.performance?.description ?? ''}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      lighthouse: {
                        ...prev.lighthouse,
                        performance: {
                          ...prev.lighthouse.performance,
                          description: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Describe qué significa este puntaje..."
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none min-h-[100px]"
                />
                <p className="text-xs text-white/40 mt-2">
                  {draft.lighthouse.performance?.description?.length ?? 0} / 300 caracteres
                </p>
              </div>

              {/* Accessibility */}
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <label className="block text-sm font-semibold text-white mb-3">Accessibility</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.lighthouse.accessibility?.score ?? 0}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      lighthouse: {
                        ...prev.lighthouse,
                        accessibility: {
                          ...prev.lighthouse.accessibility,
                          score: Number(e.target.value || 0),
                        },
                      },
                    }))
                  }
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 mb-3"
                />
                <textarea
                  value={draft.lighthouse.accessibility?.description ?? ''}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      lighthouse: {
                        ...prev.lighthouse,
                        accessibility: {
                          ...prev.lighthouse.accessibility,
                          description: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Describe qué significa este puntaje..."
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none min-h-[100px]"
                />
                <p className="text-xs text-white/40 mt-2">
                  {draft.lighthouse.accessibility?.description?.length ?? 0} / 300 caracteres
                </p>
              </div>

              {/* Best Practices */}
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <label className="block text-sm font-semibold text-white mb-3">Best Practices</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.lighthouse.bestPractices?.score ?? 0}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      lighthouse: {
                        ...prev.lighthouse,
                        bestPractices: {
                          ...prev.lighthouse.bestPractices,
                          score: Number(e.target.value || 0),
                        },
                      },
                    }))
                  }
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 mb-3"
                />
                <textarea
                  value={draft.lighthouse.bestPractices?.description ?? ''}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      lighthouse: {
                        ...prev.lighthouse,
                        bestPractices: {
                          ...prev.lighthouse.bestPractices,
                          description: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Describe qué significa este puntaje..."
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none min-h-[100px]"
                />
                <p className="text-xs text-white/40 mt-2">
                  {draft.lighthouse.bestPractices?.description?.length ?? 0} / 300 caracteres
                </p>
              </div>

              {/* SEO */}
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <label className="block text-sm font-semibold text-white mb-3">SEO</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.lighthouse.seo?.score ?? 0}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      lighthouse: {
                        ...prev.lighthouse,
                        seo: {
                          ...prev.lighthouse.seo,
                          score: Number(e.target.value || 0),
                        },
                      },
                    }))
                  }
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 mb-3"
                />
                <textarea
                  value={draft.lighthouse.seo?.description ?? ''}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      lighthouse: {
                        ...prev.lighthouse,
                        seo: {
                          ...prev.lighthouse.seo,
                          description: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="Describe qué significa este puntaje..."
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none min-h-[100px]"
                />
                <p className="text-xs text-white/40 mt-2">
                  {draft.lighthouse.seo?.description?.length ?? 0} / 300 caracteres
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Proyecto auditado</label>
              <input
                value={draft.lighthouse.auditedProject}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    lighthouse: {
                      ...prev.lighthouse,
                      auditedProject: e.target.value,
                    },
                  }))
                }
                className="w-full border border-white/20 rounded-lg px-4 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50"
                placeholder="Ej: AVC Inmobiliaria y Constructora"
              />
              <p className="text-xs text-white/50 mt-2">
                Estos datos alimentan el módulo de Trust &amp; Authority en el Hero.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Soporte */}
        {activeTab === 'soporte' && (
          <div className="space-y-4 animate-in fade-in-50">
            <div>
              <div className="mb-4">
                <h4 className="font-semibold text-white">Tarjetas de diferencial</h4>
                <p className="text-xs text-white/60 mt-1">Edita badge, título y descripción de cada tarjeta en la sección de autonomía.</p>
              </div>

              <div className="space-y-3">
                {draft.autonomyCards.map((card, index) => (
                  <div key={`${card.title}-${index}`} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider">Tarjeta {index + 1}</label>
                    <input
                      value={card.badge}
                      onChange={(e) => {
                        const next = [...draft.autonomyCards]
                        next[index] = { ...next[index], badge: e.target.value }
                        setDraft((prev) => ({ ...prev, autonomyCards: next }))
                      }}
                      className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white"
                      placeholder="Badge"
                    />
                    <input
                      value={card.title}
                      onChange={(e) => {
                        const next = [...draft.autonomyCards]
                        next[index] = { ...next[index], title: e.target.value }
                        setDraft((prev) => ({ ...prev, autonomyCards: next }))
                      }}
                      className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white"
                      placeholder="Título"
                    />
                    <textarea
                      value={card.description}
                      onChange={(e) => {
                        const next = [...draft.autonomyCards]
                        next[index] = { ...next[index], description: e.target.value }
                        setDraft((prev) => ({ ...prev, autonomyCards: next }))
                      }}
                      placeholder="Descripción"
                      className="w-full min-h-[90px] border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-forge-blue-mid/50 resize-none"
                    />
                  </div>
                ))}
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

  const normalizeLighthouseMetric = (
    metric: any,
    defaultScore: number,
    defaultDesc: string
  ) => ({
    score: typeof metric?.score === 'number' ? metric.score : defaultScore,
    description: typeof metric?.description === 'string' ? metric.description : defaultDesc,
  })

  return {
    ...about,
    heroSubtitle:
      String((about as unknown as Record<string, unknown>)?.heroSubtitle ?? '').trim() ||
      'Diseñamos, construimos y optimizamos plataformas web con métricas verificables, acompañamiento cercano y decisiones técnicas enfocadas en resultados de negocio.',
    pillars: mergedDifferentiationItems,
    differentiators: [],
    projectsInProgress,
    supportItems: padSupportItems(about.supportItems),
    autonomyCards: normalizeAutonomyCardsDraft(about),
    homeContent: {
      hero: {
        badge: about.homeContent?.hero?.badge || DEFAULT_ABOUT.homeContent.hero.badge,
        title: about.homeContent?.hero?.title || DEFAULT_ABOUT.homeContent.hero.title,
        highlight: about.homeContent?.hero?.highlight || DEFAULT_ABOUT.homeContent.hero.highlight,
        primaryCta: about.homeContent?.hero?.primaryCta || DEFAULT_ABOUT.homeContent.hero.primaryCta,
        secondaryCta:
          about.homeContent?.hero?.secondaryCta || DEFAULT_ABOUT.homeContent.hero.secondaryCta,
      },
      projects: {
        eyebrow: about.homeContent?.projects?.eyebrow || DEFAULT_ABOUT.homeContent.projects.eyebrow,
        title: about.homeContent?.projects?.title || DEFAULT_ABOUT.homeContent.projects.title,
        description: about.homeContent?.projects?.description || DEFAULT_ABOUT.homeContent.projects.description,
        deliveredLabel:
          about.homeContent?.projects?.deliveredLabel || DEFAULT_ABOUT.homeContent.projects.deliveredLabel,
        inProgressLabel:
          about.homeContent?.projects?.inProgressLabel || DEFAULT_ABOUT.homeContent.projects.inProgressLabel,
        notesTitle: about.homeContent?.projects?.notesTitle || DEFAULT_ABOUT.homeContent.projects.notesTitle,
      },
      pricing: {
        eyebrow: about.homeContent?.pricing?.eyebrow || DEFAULT_ABOUT.homeContent.pricing.eyebrow,
        title: about.homeContent?.pricing?.title || DEFAULT_ABOUT.homeContent.pricing.title,
        description: about.homeContent?.pricing?.description || DEFAULT_ABOUT.homeContent.pricing.description,
        legalNote: about.homeContent?.pricing?.legalNote || DEFAULT_ABOUT.homeContent.pricing.legalNote,
        ctaLabel: about.homeContent?.pricing?.ctaLabel || DEFAULT_ABOUT.homeContent.pricing.ctaLabel,
      },
      roadmap: {
        eyebrow: about.homeContent?.roadmap?.eyebrow || DEFAULT_ABOUT.homeContent.roadmap.eyebrow,
        title: about.homeContent?.roadmap?.title || DEFAULT_ABOUT.homeContent.roadmap.title,
        description: about.homeContent?.roadmap?.description || DEFAULT_ABOUT.homeContent.roadmap.description,
        ctaTitle: about.homeContent?.roadmap?.ctaTitle || DEFAULT_ABOUT.homeContent.roadmap.ctaTitle,
        ctaButton: about.homeContent?.roadmap?.ctaButton || DEFAULT_ABOUT.homeContent.roadmap.ctaButton,
      },
      autonomy: {
        eyebrow: about.homeContent?.autonomy?.eyebrow || DEFAULT_ABOUT.homeContent.autonomy.eyebrow,
        title: about.homeContent?.autonomy?.title || DEFAULT_ABOUT.homeContent.autonomy.title,
        description: about.homeContent?.autonomy?.description || DEFAULT_ABOUT.homeContent.autonomy.description,
      },
      contact: {
        title: about.homeContent?.contact?.title || DEFAULT_ABOUT.homeContent.contact.title,
        description: about.homeContent?.contact?.description || DEFAULT_ABOUT.homeContent.contact.description,
        responseTime: about.homeContent?.contact?.responseTime || DEFAULT_ABOUT.homeContent.contact.responseTime,
      },
    },
    experience: {
      ...about.experience,
      items: dedupeTextItems(experienceItems),
    },
    lighthouse: {
      performance: normalizeLighthouseMetric(
        about?.lighthouse?.performance,
        99,
        'El sitio carga en menos de 2 segundos. Imágenes optimizadas, CSS minimizado y JavaScript lazy-loaded.'
      ),
      accessibility: normalizeLighthouseMetric(
        about?.lighthouse?.accessibility,
        97,
        'Interfaz completamente navegable con teclado, legible para desórdenes visuales. WCAG AA cumplido.'
      ),
      bestPractices: normalizeLighthouseMetric(
        about?.lighthouse?.bestPractices,
        100,
        'Código moderno, sin librerías deprecadas. HTTPS, CSP headers y manejo seguro de datos aplicado.'
      ),
      seo: normalizeLighthouseMetric(
        about?.lighthouse?.seo,
        100,
        'Metaetiquetas, estructura semántica y Robot.txt optimizados. Indexable en Google desde el primer día.'
      ),
      auditedProject:
        String(about?.lighthouse?.auditedProject ?? '').trim() || 'AVC Inmobiliaria y Constructora',
    },
  }
}

function normalizeAutonomyCardsDraft(about: AboutContent): AboutContent['autonomyCards'] {
  const fromAbout = Array.isArray(about.autonomyCards) ? about.autonomyCards : []
  const legacy = padSupportItems(about.supportItems)

  return SUPPORT_CARD_TITLES.map((title, index) => ({
    badge: String(fromAbout[index]?.badge ?? SUPPORT_CARD_BADGES[index]).trim() || SUPPORT_CARD_BADGES[index],
    title: String(fromAbout[index]?.title ?? title).trim() || title,
    description:
      String(fromAbout[index]?.description ?? legacy[index]).trim() || legacy[index],
  }))
}

function padSupportItems(items: string[]): string[] {
  const normalized = [...items].map((item) => String(item ?? '').trim())
  const defaults = [
    'El código fuente, repositorio y accesos quedan a nombre del cliente al finalizar la entrega.',
    'Entregamos manual PDF y video explicativo para que tu equipo pueda operar la plataforma sin depender de terceros.',
    'Atención directa por WhatsApp con el equipo técnico para resolver dudas operativas y ajustes puntuales.',
    'Definimos procesos para que puedas administrar contenidos y tareas comunes sin fricción técnica diaria.',
  ]

  return SUPPORT_CARD_TITLES.map((_, index) => normalized[index] || defaults[index])
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
