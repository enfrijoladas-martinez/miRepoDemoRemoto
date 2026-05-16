import { Navigate } from 'react-router-dom'
export default function RutaProtegida({ user, loading, children }) {
  if (loading) return <div className="cargando">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}
