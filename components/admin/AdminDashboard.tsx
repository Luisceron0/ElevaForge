'use client'

import { useEffect, useMemo, useState } from 'react'
import { Lead } from '@/types/lead'
import { SiteContent, TeamCapability } from '@/lib/site-content'
import TeamAdminEditor from './TeamAdminEditor'

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
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'sent' | 'failed'>('all')
  const [savingKey, setSavingKey] = useState<'' | 'about' | 'projects' | 'packages' | 'team'>('')
  const [adminUsers, setAdminUsers] = useState<AdminUserRow[]>([])
  const [adminsLoading, setAdminsLoading] = useState(true)
  const [adminsSaving, setAdminsSaving] = useState(false)
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [okMsg, setOkMsg] = useState('')

  const [aboutText, setAboutText] = useState(JSON.stringify(content.about, null, 2))
  const [projectsText, setProjectsText] = useState(JSON.stringify(content.projects, null, 2))
  const [packagesText, setPackagesText] = useState(JSON.stringify(content.packages, null, 2))

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

  function saveAbout() {
    try {
      const parsed = JSON.parse(aboutText)
      saveContent('about', parsed)
    } catch {
      setErrorMsg('El JSON de Quiénes somos no es válido')
    }
  }

  function saveProjects() {
    try {
      const parsed = JSON.parse(projectsText)
      saveContent('projects', parsed)
    } catch {
      setErrorMsg('El JSON de proyectos no es válido')
    }
  }

  function savePackages() {
    try {
      const parsed = JSON.parse(packagesText)
      saveContent('packages', parsed)
    } catch {
      setErrorMsg('El JSON de paquetes no es válido')
    }
  }

  async function saveTeam(team: TeamCapability[]) {
    const updatedAbout = { ...content.about, team }
    await saveContent('about', updatedAbout)
    // Sync textarea so both editors stay consistent
    setAboutText(JSON.stringify(updatedAbout, null, 2))
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

  async function toggleAdminUser(user: AdminUserRow) {
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
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <main className="min-h-screen bg-forge-bg-light py-8">
      <div className="container mx-auto px-4 space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-forge-bg-dark">Panel de Administración</h1>
            <p className="text-forge-bg-dark/70">Gestiona textos, proyectos, paquetes y leads.</p>
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

        <section className="bg-white rounded-2xl shadow p-5 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-forge-bg-dark">Administradores</h2>
            <p className="text-sm text-forge-bg-dark/70">Gestiona usuarios admin almacenados en Supabase.</p>
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
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">Usuario</th>
                  <th className="py-2 pr-2">Estado</th>
                  <th className="py-2 pr-2">Creado</th>
                  <th className="py-2 pr-2">Acción</th>
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
                  adminUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2 pr-2">{user.username}</td>
                      <td className="py-2 pr-2">{user.is_active ? 'Activo' : 'Inactivo'}</td>
                      <td className="py-2 pr-2 text-forge-bg-dark/70">
                        {user.created_at ? new Date(user.created_at).toLocaleString('es-CO') : '-'}
                      </td>
                      <td className="py-2 pr-2">
                        <button
                          onClick={() => toggleAdminUser(user)}
                          className="border rounded px-3 py-1 hover:bg-forge-bg-light"
                        >
                          {user.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))
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

        <TeamAdminEditor
          team={content.about.team}
          saving={savingKey === 'about' || savingKey === 'team'}
          onSave={saveTeam}
        />

        <section className="bg-white rounded-2xl shadow p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-forge-bg-dark">Quiénes somos (JSON avanzado)</h2>
            <button
              onClick={saveAbout}
              disabled={savingKey === 'about'}
              className="bg-forge-orange-main text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {savingKey === 'about' ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          <p className="text-sm text-forge-bg-dark/70">Edita el JSON completo de la sección (avanzado). Los cambios del equipo aquí sobreescriben el editor visual de arriba.</p>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full min-h-[300px] font-mono text-sm border rounded-lg p-3"
          />
        </section>

        <section className="bg-white rounded-2xl shadow p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-forge-bg-dark">Proyectos</h2>
            <button
              onClick={saveProjects}
              disabled={savingKey === 'projects'}
              className="bg-forge-orange-main text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {savingKey === 'projects' ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          <p className="text-sm text-forge-bg-dark/70">Incluye textos, URLs e imágenes (imageUrl).</p>
          <textarea
            value={projectsText}
            onChange={(e) => setProjectsText(e.target.value)}
            className="w-full min-h-[240px] font-mono text-sm border rounded-lg p-3"
          />
        </section>

        <section className="bg-white rounded-2xl shadow p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-forge-bg-dark">Paquetes</h2>
            <button
              onClick={savePackages}
              disabled={savingKey === 'packages'}
              className="bg-forge-orange-main text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {savingKey === 'packages' ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
          <p className="text-sm text-forge-bg-dark/70">Puedes ajustar precios, bullets y textos de venta.</p>
          <textarea
            value={packagesText}
            onChange={(e) => setPackagesText(e.target.value)}
            className="w-full min-h-[240px] font-mono text-sm border rounded-lg p-3"
          />
        </section>

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
      </div>
    </main>
  )
}
