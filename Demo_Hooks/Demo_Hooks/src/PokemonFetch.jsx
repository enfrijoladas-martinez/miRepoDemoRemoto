import { useState, useEffect } from 'react'

const POKEMONS = ['charmander','squirtle','bulbasaur','pikachu','eevee','jigglypuff']

export default function PokemonFetch() {
  const [seleccion, setSeleccion] = useState('pikachu')
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setCargando(true)
    fetch(`https://pokeapi.co/api/v2/pokemon/${seleccion}`)
      .then(r => r.json())
      .then(d => { setPokemon(d); setCargando(false) })
      .catch(() => setCargando(false))
  }, [seleccion])

  return (
    <div>
      <select value={seleccion} onChange={e=>setSeleccion(e.target.value)} style={{padding:'0.7rem',borderRadius:'10px',marginBottom:'1rem',fontSize:'1rem'}}>
        {POKEMONS.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      {cargando ? <p>Cargando...</p> : pokemon && (
        <div>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{width:150}} />
          <h3 style={{textTransform:'capitalize'}}>{pokemon.name}</h3>
          <p>#{pokemon.id} · {pokemon.types.map(t=>t.type.name).join(', ')}</p>
        </div>
      )}
    </div>
  )
}
