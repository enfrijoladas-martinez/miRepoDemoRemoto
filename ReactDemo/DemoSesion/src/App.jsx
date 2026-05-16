import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login.jsx'
import Dashboard from './auth/Dashboard.jsx'
import RutaProtegida from './auth/RutaProtegida.jsx'
import useAuth from './session/useAuth.js'

function App() {
  const { usuario, cargando, checkAuth } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={usuario ? <Navigate to="/dashboard" /> : <Login onLogin={checkAuth} />} />
      <Route path="/dashboard" element={<RutaProtegida user={usuario} loading={cargando}><Dashboard user={usuario} onLogout={() => { document.cookie = 'token=;max-age=0'; checkAuth() }} /></RutaProtegida>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
export default App
