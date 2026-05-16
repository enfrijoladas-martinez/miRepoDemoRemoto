import { useState } from 'react'
import Contador from './Contador.jsx'
import Reloj from './Reloj.jsx'
import PokemonFetch from './PokemonFetch.jsx'
import './App.css'

function App() {
  const [seccion, setSeccion] = useState('contador')
  return (
    <div className="app">
      <h1>🧪 React Hooks - Elías</h1>
      <nav className="tabs">
        <button className={seccion==='contador'?'activo':''} onClick={()=>setSeccion('contador')}>Contador</button>
        <button className={seccion==='reloj'?'activo':''} onClick={()=>setSeccion('reloj')}>Reloj</button>
        <button className={seccion==='pokemon'?'activo':''} onClick={()=>setSeccion('pokemon')}>Pokémon</button>
      </nav>
      <div className="contenido">
        {seccion==='contador' && <Contador />}
        {seccion==='reloj' && <Reloj />}
        {seccion==='pokemon' && <PokemonFetch />}
      </div>
    </div>
  )
}
export default App
