import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

const app = express()
const PORT = 4000
const SECRET = 'clave-super-secreta-elias'

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

app.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username === 'admin' && password === '12345') {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' })
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' })
    return res.json({ message: 'Login exitoso' })
  }
  return res.status(401).json({ message: 'Credenciales inválidas' })
})

app.get('/perfil', (req, res) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'No autenticado' })
  try {
    const user = jwt.verify(token, SECRET)
    res.json({ message: 'Usuario autenticado', user })
  } catch { return res.status(401).json({ message: 'Token inválido' }) }
})

app.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logout exitoso' })
})

app.listen(PORT, () => console.log(`Servidor de sesión en http://localhost:${PORT}`))
