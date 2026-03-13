import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { hasAdminSession } from '@/lib/security/admin-session'
import LoginForm from './LoginForm'

// Prevent search engines from indexing the admin login page
export const metadata: Metadata = {
  title: 'Acceso restringido',
  robots: { index: false, follow: false, noarchive: true },
}

export default async function AdminLoginPage() {
  // Server-side: redirect to dashboard if already authenticated
  if (await hasAdminSession()) {
    redirect('/admin')
  }

  return (
    <main className="min-h-screen bg-forge-bg-dark flex items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  )
}
