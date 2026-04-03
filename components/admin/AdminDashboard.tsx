'use client'

import { useEffect, useMemo, useState } from 'react'
import { Lead } from '@/types/lead'
import { AboutContent, PackagePlan, ProjectItem, SiteContent, TeamCapability } from '@/lib/site-content'
import TeamAdminEditor from './TeamAdminEditor'
import ProjectsAdminEditor from './ProjectsAdminEditor'
import PackagesAdminEditor from './PackagesAdminEditor'
import AboutAdminEditor from './AboutAdminEditor'
import AdminNavbar from '@/components/admin/AdminNavbar'

interface Props {
  initialContent: SiteContent
  initialLeads: Lead[]
}

interface AdminUserRow {
  id: string
  username: string
  is_active: boolean
  created_at: string | null
}

export default function AdminDashboard({ initialContent, initialLeads }: Props) {
  const [content, setContent] = useState<SiteContent>(initialContent)
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [panelView, setPanelView] = useState<'content' | 'admins' | 'leads'>('content')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'sent' | 'failed'>('all')
  const [savingKey, setSavingKey] = useState<'' | 'about' | 'projects' | 'packages' | 'team'>('')
  const [adminUsers, setAdminUsers] = useState<AdminUserRow[]>([])
  const [adminsLoading, setAdminsLoading] = useState(true)
  const [adminsSaving, setAdminsSaving] = useState(false)
  const [adminsUpdating, setAdminsUpdating] = useState(false)
  const [adminsDeleting, setAdminsDeleting] = useState(false)
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null)
  const [editingAdminUsername, setEditingAdminUsername] = useState('')
  const [editingAdminPassword, setEditingAdminPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [okMsg, setOkMsg] = useState('')

  const filteredLeads = useMemo(() => {
    if (statusFilter === 'all') return leads
    return leads.filter((lead) => lead.status === statusFilter)
  }, [leads, statusFilter])

  useEffect(() => {
    void loadAdmins()
  }, [])

  async function loadAdmins() {
    setAdminsLoading(true)
    try {
      const response = await fetch('/api/admin/users', { method: 'GET' })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudieron cargar los administradores')
      }

      setAdminUsers(Array.isArray(payload?.rows) ? payload.rows : [])
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error cargando administradores')
    } finally {
      setAdminsLoading(false)
    }
  }

  async function saveContent<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setErrorMsg('')
    setOkMsg('')
    setSavingKey(key)

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo guardar el contenido')
      }

      setContent((prev) => ({ ...prev, [key]: value }))
      setOkMsg(`Contenido "${key}" actualizado correctamente.`)
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error al guardar')
    } finally {
      setSavingKey('')
    }
  }

  async function saveAboutVisual(about: AboutContent) {
    await saveContent('about', about)
  }

  async function saveTeam(team: TeamCapability[]) {
    const updatedAbout = { ...content.about, team }
    await saveContent('about', updatedAbout)
  }

  async function saveProjectsVisual(projects: ProjectItem[]) {
    await saveContent('projects', projects)
  }

  async function saveProjectNarrativeVisual(value: Pick<AboutContent, 'experience' | 'projectsInProgress'>) {
    const updatedAbout = {
      ...content.about,
      experience: value.experience,
      projectsInProgress: value.projectsInProgress,
    }
    await saveContent('about', updatedAbout)
  }

  async function savePackagesVisual(plans: PackagePlan[]) {
    await saveContent('packages', plans)
  }

  async function createAdminUser() {
    setErrorMsg('')
    setOkMsg('')
    setAdminsSaving(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newAdminUsername, password: newAdminPassword }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo crear el administrador')
      }

      const row = payload?.row as AdminUserRow | undefined
      if (row) {
        setAdminUsers((prev) => [...prev, row])
      }

      setNewAdminUsername('')
      setNewAdminPassword('')
      setOkMsg('Administrador creado correctamente')
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error creando administrador')
    } finally {
      setAdminsSaving(false)
    }
  }

  function startEditAdmin(user: AdminUserRow) {
    setEditingAdminId(user.id)
    setEditingAdminUsername(user.username)
    setEditingAdminPassword('')
    setErrorMsg('')
    setOkMsg('')
  }

  function cancelEditAdmin() {
    setEditingAdminId(null)
    setEditingAdminUsername('')
    setEditingAdminPassword('')
  }

  async function updateAdminUser(id: string) {
    setErrorMsg('')
    setOkMsg('')
    setAdminsUpdating(true)

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editingAdminUsername,
          password: editingAdminPassword || undefined,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo actualizar el administrador')
      }

      const row = payload?.row as AdminUserRow | undefined
      if (row) {
        setAdminUsers((prev) => prev.map((item) => (item.id === row.id ? row : item)))
      }

      cancelEditAdmin()
      setOkMsg('Administrador actualizado correctamente')
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error actualizando administrador')
    } finally {
      setAdminsUpdating(false)
    }
  }

  async function deleteAdminUser(user: AdminUserRow) {
    if (!window.confirm(`¿Eliminar definitivamente al administrador ${user.username}?`)) return

    setErrorMsg('')
    setOkMsg('')
    setAdminsDeleting(true)

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo eliminar el administrador')
      }

      setAdminUsers((prev) => prev.filter((item) => item.id !== user.id))
      if (editingAdminId === user.id) {
        cancelEditAdmin()
      }
      setOkMsg('Administrador eliminado correctamente')
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error eliminando administrador')
    } finally {
      setAdminsDeleting(false)
    }
  }

  async function toggleAdminUser(user: AdminUserRow) {
    if (user.is_active && !window.confirm('¿Desactivar este administrador?')) return

    setErrorMsg('')
    setOkMsg('')

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !user.is_active }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo actualizar el administrador')
      }

      const row = payload?.row as AdminUserRow | undefined
      if (row) {
        setAdminUsers((prev) => prev.map((item) => (item.id === row.id ? row : item)))
      }

      setOkMsg(`Administrador ${user.is_active ? 'desactivado' : 'activado'} correctamente`)
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error actualizando administrador')
    }
  }

  async function updateLeadStatus(id: string, status: 'pending' | 'sent' | 'failed') {
    setErrorMsg('')
    setOkMsg('')

    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo actualizar el lead')
      }

      setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)))
      setOkMsg('Estado del lead actualizado')
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error al actualizar lead')
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    window.location.href = '/admin/login'
  }

  return (
    <>
      <AdminNavbar onLogout={logout} onNavigate={(k) => setPanelView(k)} />
      <main className="pt-20 bg-forge-bg-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Mensajes de estado */}
          {errorMsg && (
            <div className="mb-6 rounded-xl border border-red-500 bg-red-950 text-red-200 px-4 py-3 text-sm animate-in">{errorMsg}</div>
          )}
          {okMsg && (
            <div className="mb-6 rounded-xl border border-green-500 bg-green-950 text-green-200 px-4 py-3 text-sm animate-in">{okMsg}</div>
          )}

          {/* CONTENT TAB */}
          {panelView === 'content' && (
            <div className="space-y-6">
              {/* Proyectos - Full width */}
              <div className="bg-[#1F1F3A] rounded-2xl border border-white/10 p-8 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white">Proyectos</h2>
                  <p className="text-sm text-white/60 mt-1">Gestiona proyectos y narrativa institucional</p>
                </div>
                <ProjectsAdminEditor
                  projects={content.projects}
                  narrative={{
                    experience: content.about.experience,
                    projectsInProgress: content.about.projectsInProgress,
                  }}
                  saving={savingKey === 'projects'}
                  narrativeSaving={savingKey === 'about'}
                  onSave={saveProjectsVisual}
                  onSaveNarrative={saveProjectNarrativeVisual}
                />
              </div>

              {/* About & Team - 2 Columns */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-[#1F1F3A] rounded-2xl border border-white/10 p-8 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white">Quiénes Somos</h2>
                    <p className="text-sm text-white/60 mt-1">Sección institucional</p>
                  </div>
                  <AboutAdminEditor
                    about={content.about}
                    saving={savingKey === 'about'}
                    onSave={saveAboutVisual}
                  />
                </div>

                <div className="bg-[#1F1F3A] rounded-2xl border border-white/10 p-8 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white">Equipo</h2>
                    <p className="text-sm text-white/60 mt-1">Miembros y especialidades</p>
                  </div>
                  <TeamAdminEditor
                    team={content.about.team}
                    saving={savingKey === 'about' || savingKey === 'team'}
                    onSave={saveTeam}
                  />
                </div>
              </div>

              {/* Packages - Full width */}
              <div className="bg-[#1F1F3A] rounded-2xl border border-white/10 p-8 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white">Paquetes de Precios</h2>
                  <p className="text-sm text-white/60 mt-1">Planes y estructura comercial</p>
                </div>
                <PackagesAdminEditor
                  plans={content.packages}
                  saving={savingKey === 'packages'}
                  onSave={savePackagesVisual}
                />
              </div>
            </div>
          )}

          {/* ADMINS TAB */}
          {panelView === 'admins' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lista de admins - 2 columns */}
              <div className="lg:col-span-2 bg-[#1F1F3A] rounded-2xl border border-white/10 p-8 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-6">Usuarios Activos</h2>
                <div className="overflow-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="py-3 px-4 text-left font-semibold text-white">Usuario</th>
                        <th className="py-3 px-4 text-left font-semibold text-white">Estado</th>
                        <th className="py-3 px-4 text-right font-semibold text-white">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminsLoading ? (
                        <tr>
                          <td colSpan={3} className="py-12 text-center text-white/40">Cargando...</td>
                        </tr>
                      ) : adminUsers.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-12 text-center text-white/40">Sin administradores registrados</td>
                        </tr>
                      ) : (
                        adminUsers.map((user) => {
                          const isEditing = editingAdminId === user.id
                          return (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4 px-4">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editingAdminUsername}
                                    onChange={(e) => setEditingAdminUsername(e.target.value)}
                                    className="w-full border border-white/20 rounded-lg px-2 py-1.5 text-sm bg-white/10 text-white"
                                  />
                                ) : (
                                  <span className="font-medium text-white">{user.username}</span>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                  user.is_active
                                    ? 'bg-green-900/50 text-green-300 border border-green-500/50'
                                    : 'bg-gray-900/50 text-gray-400 border border-gray-600/50'
                                }`}>
                                  {user.is_active ? '🟢 Activo' : '⚫ Inactivo'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex gap-1 justify-end">
                                  {isEditing ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => updateAdminUser(user.id)}
                                        disabled={adminsUpdating}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-green-500/50 text-green-300 hover:bg-green-900/20 disabled:opacity-50"
                                      >
                                        Guardar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={cancelEditAdmin}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:bg-white/10"
                                      >
                                        Cancelar
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => startEditAdmin(user)}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
                                      >
                                        ✏️ Editar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => toggleAdminUser(user)}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
                                      >
                                        {user.is_active ? '⊘ Desactivar' : '✓ Activar'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => deleteAdminUser(user)}
                                        disabled={adminsDeleting}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/50 text-red-300 hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                                      >
                                        🗑 Eliminar
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Crear nuevo - Sidebar */}
              <div className="lg:col-span-1 bg-[#1F1F3A] rounded-2xl border border-white/10 p-8 shadow-lg h-fit">
                <h3 className="text-lg font-semibold text-white mb-6">Nuevo Admin</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-2">Usuario</label>
                    <input
                      type="text"
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      placeholder="username"
                      className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-forge-blue-mid/30 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-2">Contraseña</label>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Mín. 10 caracteres"
                      className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-forge-blue-mid/30 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={createAdminUser}
                    disabled={adminsSaving}
                    className="w-full bg-forge-blue-mid text-white font-medium py-2 rounded-lg hover:bg-forge-blue-mid/90 disabled:opacity-50 transition-colors"
                  >
                    {adminsSaving ? 'Creando...' : '+ Crear Admin'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewAdminUsername('')
                      setNewAdminPassword('')
                    }}
                    className="w-full border border-white/20 text-white py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LEADS TAB */}
          {panelView === 'leads' && (
            <div className="bg-[#1F1F3A] rounded-2xl border border-white/10 p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Leads Recibidos</h2>
                  <p className="text-sm text-white/60 mt-1">{filteredLeads.length} leads encontrados</p>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'sent' | 'failed')}
                  className="border border-white/20 rounded-lg px-4 py-2.5 bg-white/10 text-sm font-medium text-white"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="all">📊 Todos</option>
                  <option value="pending">⏳ Pendientes</option>
                  <option value="sent">✅ Enviados</option>
                  <option value="failed">❌ Fallidos</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white">Fecha</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white">Nombre</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white">Email</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white">Empresa</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white">Teléfono</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white">Estado</th>
                      <th className="py-3 px-4 text-right text-xs font-semibold text-white">Actualizar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-white/40 text-sm">
                          No hay leads para este filtro
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 text-sm text-white/70">
                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-CO') : '-'}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-white">{lead.nombre}</td>
                          <td className="py-4 px-4 text-sm text-white/70 truncate">{lead.email}</td>
                          <td className="py-4 px-4 text-sm text-white/70">{lead.empresa || '-'}</td>
                          <td className="py-4 px-4 text-sm text-white/70">{lead.telefono || '-'}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              lead.status === 'sent'
                                ? 'bg-green-900/50 text-green-300 border border-green-500/50'
                                : lead.status === 'failed'
                                ? 'bg-red-900/50 text-red-300 border border-red-500/50'
                                : 'bg-amber-900/50 text-amber-300 border border-amber-500/50'
                            }`}>
                              {lead.status === 'sent' ? '✅' : lead.status === 'failed' ? '❌' : '⏳'} {lead.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <select
                              value={(lead.status || 'pending') as 'pending' | 'sent' | 'failed'}
                              onChange={(e) => updateLeadStatus(lead.id || '', e.target.value as 'pending' | 'sent' | 'failed')}
                              className="border border-white/20 rounded-lg px-2 py-1.5 text-xs font-medium bg-white/10 text-white cursor-pointer hover:border-white/40"
                            >
                              <option value="pending">⏳ Pendiente</option>
                              <option value="sent">✅ Enviado</option>
                              <option value="failed">❌ Fallido</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
