'use client'

import { useEffect, useMemo, useState } from 'react'
import { Lead } from '@/types/lead'
import { AboutContent, PackagePlan, ProjectItem, SiteContent, TeamCapability } from '@/lib/site-content'
import TeamAdminEditor from './TeamAdminEditor'
import ProjectsAdminEditor from './ProjectsAdminEditor'
import PackagesAdminEditor from './PackagesAdminEditor'
import AboutAdminEditor from './AboutAdminEditor'
import ProjectNarrativeAdminEditor from './ProjectNarrativeAdminEditor'

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

  async function saveProjectNarrativeVisual(value: { experience: AboutContent['experience']; projectsInProgress: string[] }) {
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
    <main className="min-h-screen bg-forge-bg-light py-8">
      <div className="container mx-auto px-4 space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-forge-bg-dark">Panel de Administración</h1>
            <p className="text-forge-bg-dark/70">Gestiona contenido, administradores y leads desde un solo panel.</p>
          </div>
          <button
            onClick={logout}
            className="bg-forge-bg-dark text-white px-4 py-2 rounded-lg hover:bg-forge-blue-deep transition-colors"
          >
            Cerrar sesión
          </button>
        </header>

        {errorMsg && (
          <div className="rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3">{errorMsg}</div>
        )}
        {okMsg && (
          <div className="rounded-lg border border-green-300 bg-green-50 text-green-700 px-4 py-3">{okMsg}</div>
        )}

        <nav className="bg-white rounded-2xl shadow p-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <button
              onClick={() => setPanelView('content')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                panelView === 'content'
                  ? 'bg-forge-blue-mid text-white'
                  : 'border border-forge-bg-dark/15 text-forge-bg-dark hover:bg-forge-bg-light'
              }`}
            >
              Contenido del sitio
            </button>
            <button
              onClick={() => setPanelView('admins')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                panelView === 'admins'
                  ? 'bg-forge-blue-mid text-white'
                  : 'border border-forge-bg-dark/15 text-forge-bg-dark hover:bg-forge-bg-light'
              }`}
            >
              Administradores
            </button>
            <button
              onClick={() => setPanelView('leads')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                panelView === 'leads'
                  ? 'bg-forge-blue-mid text-white'
                  : 'border border-forge-bg-dark/15 text-forge-bg-dark hover:bg-forge-bg-light'
              }`}
            >
              Leads
            </button>
          </div>
        </nav>

        {panelView === 'content' && (
          <>
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-forge-bg-dark">Gestión de proyectos</h2>
                <p className="text-sm text-forge-bg-dark/70">
                  Cards de proyectos y narrativa institucional en un único bloque para evitar edición separada.
                </p>
              </div>

              <ProjectsAdminEditor
                projects={content.projects}
                saving={savingKey === 'projects'}
                onSave={saveProjectsVisual}
              />

              <ProjectNarrativeAdminEditor
                value={{
                  experience: content.about.experience,
                  projectsInProgress: content.about.projectsInProgress,
                }}
                saving={savingKey === 'about'}
                onSave={saveProjectNarrativeVisual}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-forge-bg-dark">Gestión institucional</h2>
                <p className="text-sm text-forge-bg-dark/70">Contenido de quiénes somos, equipo y soporte.</p>
              </div>

              <AboutAdminEditor
                about={content.about}
                saving={savingKey === 'about'}
                onSave={saveAboutVisual}
              />

              <TeamAdminEditor
                team={content.about.team}
                saving={savingKey === 'about' || savingKey === 'team'}
                onSave={saveTeam}
              />
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-forge-bg-dark">Gestión comercial</h2>
                <p className="text-sm text-forge-bg-dark/70">Planes y estructura de precios visibles en la landing.</p>
              </div>

              <PackagesAdminEditor
                plans={content.packages}
                saving={savingKey === 'packages'}
                onSave={savePackagesVisual}
              />
            </section>
          </>
        )}

        {panelView === 'admins' && (
          <section className="bg-white rounded-2xl shadow p-5 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-forge-bg-dark">Administradores</h2>
              <p className="text-sm text-forge-bg-dark/70">CRUD completo de usuarios admin almacenados en Supabase.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newAdminUsername}
                onChange={(e) => setNewAdminUsername(e.target.value)}
                placeholder="username"
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="password (min 10)"
                className="border rounded-lg px-3 py-2"
              />
              <button
                onClick={createAdminUser}
                disabled={adminsSaving}
                className="bg-forge-blue-mid text-white rounded-lg px-4 py-2 disabled:opacity-50"
              >
                {adminsSaving ? 'Creando...' : 'Agregar admin'}
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-2">Usuario</th>
                    <th className="py-2 pr-2">Estado</th>
                    <th className="py-2 pr-2">Creado</th>
                    <th className="py-2 pr-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {adminsLoading ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-forge-bg-dark/60">
                        Cargando administradores...
                      </td>
                    </tr>
                  ) : (
                    adminUsers.map((user) => {
                      const isEditing = editingAdminId === user.id
                      return (
                        <tr key={user.id} className="border-b align-top">
                          <td className="py-2 pr-2">
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingAdminUsername}
                                  onChange={(e) => setEditingAdminUsername(e.target.value)}
                                  className="w-full border rounded-lg px-3 py-2"
                                  placeholder="username"
                                />
                                <input
                                  type="password"
                                  value={editingAdminPassword}
                                  onChange={(e) => setEditingAdminPassword(e.target.value)}
                                  className="w-full border rounded-lg px-3 py-2"
                                  placeholder="nueva contraseña (opcional)"
                                />
                              </div>
                            ) : (
                              user.username
                            )}
                          </td>
                          <td className="py-2 pr-2">{user.is_active ? 'Activo' : 'Inactivo'}</td>
                          <td className="py-2 pr-2 text-forge-bg-dark/70">
                            {user.created_at ? new Date(user.created_at).toLocaleString('es-CO') : '-'}
                          </td>
                          <td className="py-2 pr-2">
                            <div className="flex flex-wrap gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => updateAdminUser(user.id)}
                                    disabled={adminsUpdating}
                                    className="border rounded px-3 py-1 hover:bg-forge-bg-light disabled:opacity-50"
                                  >
                                    {adminsUpdating ? 'Guardando...' : 'Guardar'}
                                  </button>
                                  <button
                                    onClick={cancelEditAdmin}
                                    className="border rounded px-3 py-1 hover:bg-forge-bg-light"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditAdmin(user)}
                                    className="border rounded px-3 py-1 hover:bg-forge-bg-light"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => toggleAdminUser(user)}
                                    className="border rounded px-3 py-1 hover:bg-forge-bg-light"
                                  >
                                    {user.is_active ? 'Desactivar' : 'Activar'}
                                  </button>
                                  <button
                                    onClick={() => deleteAdminUser(user)}
                                    disabled={adminsDeleting}
                                    className="border rounded px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    Eliminar
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                  {!adminsLoading && adminUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-forge-bg-dark/60">
                        No hay administradores en la tabla.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {panelView === 'leads' && (
          <section className="bg-white rounded-2xl shadow p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-xl font-semibold text-forge-bg-dark">Leads recibidos</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'sent' | 'failed')}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="sent">Enviados</option>
              <option value="failed">Fallidos</option>
            </select>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">Fecha</th>
                  <th className="py-2 pr-2">Nombre</th>
                  <th className="py-2 pr-2">Email</th>
                  <th className="py-2 pr-2">Teléfono</th>
                  <th className="py-2 pr-2">Empresa</th>
                  <th className="py-2 pr-2">Servicio</th>
                  <th className="py-2 pr-2">Presupuesto</th>
                  <th className="py-2 pr-2">Mensaje</th>
                  <th className="py-2 pr-2">Estado</th>
                  <th className="py-2 pr-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b align-top">
                    <td className="py-2 pr-2 text-forge-bg-dark/70">{lead.created_at ? new Date(lead.created_at).toLocaleString('es-CO') : '-'}</td>
                    <td className="py-2 pr-2">{lead.nombre}</td>
                    <td className="py-2 pr-2">{lead.email}</td>
                    <td className="py-2 pr-2">{lead.telefono || '-'}</td>
                    <td className="py-2 pr-2">{lead.empresa || '-'}</td>
                    <td className="py-2 pr-2">{lead.servicio || '-'}</td>
                    <td className="py-2 pr-2">{lead.presupuesto || '-'}</td>
                    <td className="py-2 pr-2 max-w-[320px]">{lead.mensaje || '-'}</td>
                    <td className="py-2 pr-2">{lead.status || 'pending'}</td>
                    <td className="py-2 pr-2">
                      <select
                        value={(lead.status || 'pending') as 'pending' | 'sent' | 'failed'}
                        onChange={(e) => updateLeadStatus(lead.id || '', e.target.value as 'pending' | 'sent' | 'failed')}
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">pending</option>
                        <option value="sent">sent</option>
                        <option value="failed">failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-forge-bg-dark/60">
                      No hay leads para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </section>
        )}
      </div>
    </main>
  )
}
