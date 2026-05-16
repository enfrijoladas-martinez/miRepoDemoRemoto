import { Router } from "express"
import { procesarPago } from "../controllers/pagoController.js"
const router = Router()
router.post("/pagar", procesarPago)
router.get("/exito", (req, res) => res.redirect("pagado.html"))
router.get("/cancelado", (req, res) => res.redirect("cancelado.html"))
export default router
