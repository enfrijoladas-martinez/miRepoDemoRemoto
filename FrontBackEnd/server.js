const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let datos = [
  { id: 1, nombre: 'Elias Martinez', email: 'elias@ucc.mx', genero: 'Masculino', servicios: ['Netflix', 'Spotify'] },
  { id: 2, nombre: 'Maria Luna', email: 'luna@ucc.mx', genero: 'Femenino', servicios: ['Disney+', 'Prime'] }
];
let nextId = 3;

app.get('/api/suscriptores', (req, res) => res.json(datos));

app.post('/api/suscriptores', (req, res) => {
  const nuevo = { id: nextId++, nombre: req.body.nombre, email: req.body.email, genero: req.body.genero, servicios: req.body.servicios };
  datos.push(nuevo);
  res.json(nuevo);
});

app.put('/api/suscriptores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = datos.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  datos[idx] = { ...datos[idx], nombre: req.body.nombre, email: req.body.email, genero: req.body.genero, servicios: req.body.servicios };
  res.json(datos[idx]);
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
