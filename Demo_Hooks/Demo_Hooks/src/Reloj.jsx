import { useState, useEffect } from 'react'
export default function Reloj() {
  const [horaActual, setHoraActual] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setHoraActual(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return <h2 style={{fontSize:'3rem',fontFamily:'monospace',color:'#00d2ff'}}>{horaActual.toLocaleTimeString('es-MX')}</h2>
}
