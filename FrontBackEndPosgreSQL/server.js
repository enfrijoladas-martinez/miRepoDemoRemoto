const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/api/suscriptores', async (req, res) => {
  const { data, error } = await supabase.from('usuariosstreaming').select('*');
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post('/api/suscriptores', async (req, res) => {
  const { data, error } = await supabase.from('usuariosstreaming').insert([{ nombre: req.body.nombre, email: req.body.email, genero: req.body.genero, servicios: req.body.servicios }]).select();
  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

app.put('/api/suscriptores/:id', async (req, res) => {
  const { data, error } = await supabase.from('usuariosstreaming').update({ nombre: req.body.nombre, email: req.body.email, genero: req.body.genero, servicios: req.body.servicios }).eq('id', req.params.id).select();
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.listen(PORT, () => console.log(`Servidor Supabase en http://localhost:${PORT}`));
