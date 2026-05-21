import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingSpinner full />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingSpinner full />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (!roles.includes(user.role)) {
    const redirect = user.role === 'admin' ? '/admin/dashboard'
      : user.role === 'pelatih' ? '/pelatih/dashboard'
      : '/user/dashboard'
    return <Navigate to={redirect} replace />
  }
  return children
}

export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner full />
  if (user) {
    const redirect = user.role === 'admin' ? '/admin/dashboard'
      : user.role === 'pelatih' ? '/pelatih/dashboard'
      : '/user/dashboard'
    return <Navigate to={redirect} replace />
  }
  return children
}
