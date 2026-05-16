const express = require("express")
const dotenv = require("dotenv")
const { createClient } = require("@supabase/supabase-js")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const path = require("path")
const fs = require("fs")

dotenv.config()
const app = express()
const PORT = 8080

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("public"))

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")))

app.post("/registrar", async (req, res) => {
  const { email, password } = req.body
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) return res.redirect(`/error.html?msg=${encodeURIComponent(error.message)}`)
  res.redirect("/registro_exitoso.html")
})

app.post("/ingresar", async (req, res) => {
  const { email, password } = req.body
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.redirect(`/error.html?msg=${encodeURIComponent(error.message)}`)
  res.cookie("access_token", data.session.access_token, { httpOnly: true })
  res.redirect("/privado")
})

app.get("/privado", async (req, res) => {
  const token = req.cookies.access_token
  if (!token) return res.redirect("/")
  const { data, error } = await supabase.auth.getUser(token)
  if (error) return res.redirect("/")
  const html = fs.readFileSync(path.join(__dirname, "public", "privado.html"), "utf8")
  res.send(html.replace("{{usuarioEmail}}", data.user.email))
})

app.get("/salir", (req, res) => {
  res.clearCookie("access_token")
  res.redirect("/")
})

app.listen(PORT, () => console.log(`🔐 Auth Supabase en http://localhost:${PORT}`))
