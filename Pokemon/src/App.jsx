import React, { useState, useEffect } from 'react';
import PokeCard from './PokeCard';
import './App.css'; // Importamos los estilos para hacerlo responsivo

function App() {
  // Aquí guardaremos la lista de pokémons y un estado para saber si está cargando
  const [pokemons, setPokemons] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPokemons = async () => {
      try {
        // 1. Pedimos la lista de los primeros 20
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const datos = await respuesta.json();

        // 2. Por cada pokemon, buscamos sus detalles (imagen, stats, etc.)
        const promesas = datos.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const detalles = await res.json();
          
          // Formateamos los datos exactamente como los pide tu componente PokeCard
          return {
            id: detalles.id,
            name: detalles.name,
            type: detalles.types[0].type.name, // Tomamos el tipo principal
            hp: detalles.stats[0].base_stat,   // El primer stat es siempre HP
            image: detalles.sprites.other['official-artwork'].front_default,
            stats: [
              { name: 'Ataque', value: detalles.stats[1].base_stat },
              { name: 'Defensa', value: detalles.stats[2].base_stat },
              { name: 'Velocidad', value: detalles.stats[5].base_stat }
            ]
          };
        });

        // Esperamos a que todos se descarguen y los guardamos
        const resultadosFinales = await Promise.all(promesas);
        setPokemons(resultadosFinales);
        setCargando(false);
      } catch (error) {
        console.error("Hubo un error trayendo los datos:", error);
        setCargando(false);
      }
    };

    obtenerPokemons();
  }, []);

  return (
    <div className="app-container">
      <h1 className="titulo">Mi Pokédex</h1>
      
      {cargando ? (
        <h2 className="cargando-texto">Cargando pokémons...</h2>
      ) : (
        <div className="pokemon-grid">
          {pokemons.map((poke) => (
            <PokeCard key={poke.id} {...poke} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;