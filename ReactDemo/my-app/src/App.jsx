import { useState } from 'react'
import Tarjeta from './componentes/Tarjeta.jsx'
import './App.css'

const personajes = [
  { id: 1, nombre: 'Mario', imagen: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/6.png', pais: 'Reino Champiñón', contenido: 'Fontanero italiano que salva princesas y come setas.' },
  { id: 2, nombre: 'Sonic', imagen: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/25.png', pais: 'Isla del Sur', contenido: 'Erizo azul supersónico que lucha contra el Dr. Eggman.' },
  { id: 3, nombre: 'Link', imagen: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/7.png', pais: 'Hyrule', contenido: 'Héroe legendario que empuña la Espada Maestra.' }
]

function App() {
  const [activo, setActivo] = useState(0)
  const p = personajes[activo]
  return (
    <div className="app">
      <h1>🎮 Galería de Personajes</h1>
      <p className="sub">Elías Martínez - React</p>
      <Tarjeta nombre={p.nombre} imagen={p.imagen} pais={p.pais} contenido={p.contenido} />
      <div className="nav-btns">
        <button onClick={() => setActivo(a => (a - 1 + personajes.length) % personajes.length)}>← Anterior</button>
        <button onClick={() => setActivo(a => (a + 1) % personajes.length)}>Siguiente →</button>
      </div>
    </div>
  )
}
export default App
