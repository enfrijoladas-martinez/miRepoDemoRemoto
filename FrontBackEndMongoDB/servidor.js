const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Usuario = require("./models/usuario.js");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB - CAMBIA ESTA URL POR TU PROPIA CONEXION
// Ejemplo: mongodb+srv://usuario:password@cluster.mongodb.net/miDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/miApp";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.log("❌ Error MongoDB:", err.message));

app.post("/api/usuarios", async (req, res) => {
  try {
    const nuevo = new Usuario({ nombre: req.body.nombre, email: req.body.email, genero: req.body.genero, plataformas: req.body.plataformas });
    const guardado = await nuevo.save();
    res.json(guardado);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/usuarios/:id", async (req, res) => {
  try {
    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, { nombre: req.body.nombre, email: req.body.email, genero: req.body.genero, plataformas: req.body.plataformas }, { new: true });
    res.json(actualizado);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
