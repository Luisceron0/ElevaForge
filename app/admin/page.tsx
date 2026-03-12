import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { hasAdminSession } from '@/lib/security/admin-session'
import { getSiteContent } from '@/lib/site-content'
import { createServerSupabaseClient } from '@/lib/supabase/server'

async function getAdminLeads() {
  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('leads')
      .select('id,nombre,email,empresa,mensaje,telefono,contacto_pref,presupuesto,servicio,consent,origen,status,attempts,created_at')
      .order('created_at', { ascending: false })
      .limit(200)

    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminPage() {
  const session = await hasAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const [content, leads] = await Promise.all([getSiteContent(), getAdminLeads()])

  return <AdminDashboard initialContent={content} initialLeads={leads} />
}
