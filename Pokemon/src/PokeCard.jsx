import React from 'react';
import './PokeCard.css';

const PokeCard = ({ name, id, image, type, hp, stats }) => {
  // Diccionario de colores basados en el tipo de Pokémon
  const typeColors = {
    fire: '#fddfdf',
    grass: '#defde0',
    electric: '#fcf7de',
    water: '#def3fd',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#e0a7f6',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#f5f5f5',
    fighting: '#e6e0d4',
    normal: '#f5f5f5'
  };

  // Selecciona el color según el tipo, por defecto usa 'normal'
  const cardColor = typeColors[type.toLowerCase()] || typeColors.normal;

  return (
    <div className="pokecard" style={{ backgroundColor: cardColor }}>
      <div className="pokecard-header">
        <h2 className="pokecard-name">{name}</h2>
        <span className="pokecard-hp">
          <small>HP</small> {hp}
        </span>
      </div>
      
      <div className="pokecard-image-container">
        <img src={image} alt={`Imagen de ${name}`} className="pokecard-image" />
      </div>

      <div className="pokecard-body">
        <div className="pokecard-badges">
          <span className="badge type-badge">{type}</span>
          <span className="badge id-badge">#{id.toString().padStart(3, '0')}</span>
        </div>

        <div className="pokecard-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-row">
              <span className="stat-name">{stat.name}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokeCard;