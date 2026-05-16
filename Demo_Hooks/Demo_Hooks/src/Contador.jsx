import { useState } from 'react'
export default function Contador() {
  const [valor, setValor] = useState(0)
  return (
    <div>
      <h2 style={{fontSize:'4rem',margin:'1rem 0'}}>{valor}</h2>
      <button onClick={()=>setValor(v=>v+1)} style={btnEstilo}>+</button>
      <button onClick={()=>setValor(v=>v-1)} style={{...btnEstilo,background:'#e74c3c'}}>-</button>
      <button onClick={()=>setValor(0)} style={{...btnEstilo,background:'#95a5a6'}}>Reset</button>
    </div>
  )
}
const btnEstilo = { margin:'0.5rem', padding:'0.8rem 2rem', fontSize:'1.5rem', border:'none', borderRadius:'12px', background:'#2ecc71', color:'#fff', cursor:'pointer' }
