const express = require('express');
const app = express();
const PUERTO = 4000;

app.use(express.json());

let heroes = [
  { id: 1, nombre: 'Iron Man' },
  { id: 2, nombre: 'Capitán América' },
  { id: 3, nombre: 'Thor' },
  { id: 4, nombre: 'Spider-Man' }
];

app.get('/', (req, res) => res.send('🚀 API de Superhéroes - Elías Martínez'));

app.get('/heroes', (req, res) => res.json(heroes));

app.get('/heroes/:id', (req, res) => {
  const heroe = heroes.find(h => h.id === parseInt(req.params.id));
  if (!heroe) return res.status(404).json({ error: 'Héroe no encontrado' });
  res.json(heroe);
});

app.post('/heroes', (req, res) => {
  const nuevo = { id: heroes.length + 1, nombre: req.body.nombre };
  heroes.push(nuevo);
  res.status(201).json(heroes);
});

app.listen(PUERTO, () => console.log(`Servidor corriendo en http://localhost:${PUERTO}`));
