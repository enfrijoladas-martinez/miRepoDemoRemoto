const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  genero: { type: String },
  plataformas: { type: [String], default: [] }
}, { timestamps: true });
module.exports = mongoose.model("Usuario", schema);
