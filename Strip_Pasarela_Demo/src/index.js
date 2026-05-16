import express from "express"
import cors from "cors"
import { PORT } from "./config.js"
import path from "path"
import router from "./routes/pago-routes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)
app.use(express.static(path.resolve("src/public")))

app.listen(PORT, () => console.log(`🛒 Pasarela de pago en http://localhost:${PORT}`))
