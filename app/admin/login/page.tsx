import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { hasActiveAdminSession } from '@/lib/security/admin-access'
import LoginForm from './LoginForm'

// Prevent search engines from indexing the admin login page
export const metadata: Metadata = {
  title: 'Acceso restringido',
  robots: { index: false, follow: false, noarchive: true },
}

export default async function AdminLoginPage() {
  // Server-side: redirect to dashboard if already authenticated (checks DB active status)
  if (await hasActiveAdminSession()) {
    redirect('/admin')
  }

  return (
    <main className="min-h-screen bg-forge-bg-dark flex items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  )
}
