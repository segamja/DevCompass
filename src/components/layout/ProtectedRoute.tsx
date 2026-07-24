import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute() {
  const session = useAuthStore((s) => s.session)
  const isDemo = useAuthStore((s) => s.isDemo)

  if (!session && !isDemo) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
