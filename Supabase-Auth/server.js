const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")
const fs = require("fs")
const crypto = require("crypto")

const app = express()
const PORT = 8080

// Usuarios en memoria
const usuarios = new Map()
const sesiones = new Map()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")))

app.post("/registrar", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.redirect(`/error.html?msg=${encodeURIComponent("Faltan datos")}`)
  }
  if (usuarios.has(email)) {
    return res.redirect(`/error.html?msg=${encodeURIComponent("El usuario ya existe")}`)
  }
  usuarios.set(email, { email, password, creado: new Date().toISOString() })
  console.log(`✅ Usuario registrado: ${email}`)
  res.redirect("/registro_exitoso.html")
})

app.post("/ingresar", async (req, res) => {
  const { email, password } = req.body
  const usuario = usuarios.get(email)
  if (!usuario || usuario.password !== password) {
    return res.redirect(`/error.html?msg=${encodeURIComponent("Credenciales invalidas")}`)
  }
  const token = crypto.randomBytes(32).toString("hex")
  sesiones.set(token, { email, nombre: email.split("@")[0] })
  res.cookie("access_token", token, { httpOnly: true, maxAge: 3600000 })
  console.log(`✅ Sesion iniciada: ${email}`)
  res.redirect("/privado")
})

app.get("/privado", async (req, res) => {
  const token = req.cookies.access_token
  if (!token || !sesiones.has(token)) return res.redirect("/")
  
  const sesion = sesiones.get(token)
  let html
  try {
    html = fs.readFileSync(path.join(__dirname, "public", "privado.html"), "utf8")
  } catch {
    return res.status(500).send("Error interno")
  }
  res.send(html.replace("{{usuarioEmail}}", sesion.email))
})

app.get("/salir", (req, res) => {
  const token = req.cookies.access_token
  if (token) sesiones.delete(token)
  res.clearCookie("access_token")
  res.redirect("/")
})

app.listen(PORT, () => console.log(`🔐 Auth (modo demo) en http://localhost:${PORT}`))
