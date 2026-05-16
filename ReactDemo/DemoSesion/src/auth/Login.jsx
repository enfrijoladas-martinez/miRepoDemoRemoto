import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function Login({ onLogin }) {
  const [user, setUser] = useState('admin')
  const [pass, setPass] = useState('12345')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const login = async () => {
    setError('')
    const res = await fetch('http://localhost:4000/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ username: user, password: pass })
    })
    if (res.ok) { await onLogin(); navigate('/dashboard') }
    else setError('Credenciales incorrectas')
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 Iniciar Sesión</h1>
        {error && <p className="error">{error}</p>}
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="Usuario" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Contraseña" />
        <button onClick={login}>Entrar</button>
      </div>
    </div>
  )
}
