import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import PublicFooter from '@/components/layout/PublicFooter'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <NavBar user={user} />
      <main className="dashboard-main" style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {children}
      </main>
      <PublicFooter />
      <style>{`
        @media (max-width: 640px) {
          .dashboard-main { padding: 1.25rem 1rem !important; }
        }
      `}</style>
    </div>
  )
}
