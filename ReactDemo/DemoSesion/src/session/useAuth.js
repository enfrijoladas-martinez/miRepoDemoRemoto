import { useState } from 'react'
export default function useAuth() {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:4000/perfil', { credentials: 'include' })
      if (res.ok) { const data = await res.json(); setUsuario(data.user) }
      else setUsuario(null)
    } catch { setUsuario(null) }
    setCargando(false)
  }
  useState(() => { checkAuth() }, [])
  return { usuario, cargando, checkAuth }
}
