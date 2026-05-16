import React from 'react'
import '../estilos/tarjeta.css'

function Tarjeta(props) {
  return (
    <div className='tarjeta'>
      <div className='img-wrapper'>
        <img src={props.imagen} alt={props.nombre} />
      </div>
      <div className='info'>
        <h2 className='nombre'>{props.nombre}</h2>
        <p className='pais'>🌍 {props.pais}</p>
        <p className='texto'>{props.contenido}</p>
      </div>
    </div>
  )
}
export default Tarjeta
