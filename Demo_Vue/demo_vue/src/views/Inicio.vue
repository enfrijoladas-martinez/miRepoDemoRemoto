<template>
  <div class="home">
    <div class="hero"><h1>🚀 Demo Vue.js</h1><p class="sub">Elías Martínez - Actividad Vue</p></div>
    <div class="grid">
      <div class="card"><h3>Contador</h3><div class="count" :class="{par:esPar}">{{contador}}</div>
        <div class="btns"><button class="btn menos" @click="contador--">−</button><button class="btn mas" @click="contador++">+</button><button class="btn reset" @click="contador=0">↺</button></div>
      </div>
      <div class="card"><ContactoForm /></div>
    </div>
    <div class="card pokemon-section"><h3>Pokémon</h3><div class="poke-grid">
      <CartaPokemon v-for="p in pokemones" :key="p.num" :nombre="p.nombre" :img="p.img" :tipos="p.tipos" :num="p.num" />
    </div></div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import ContactoForm from '../components/ContactoForm.vue'
import CartaPokemon from '../components/CartaPokemon.vue'

const contador = ref(0)
const esPar = computed(() => contador.value % 2 === 0)

const pokemones = [
  { nombre:'bulbasaur', num:'001', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', tipos:['grass','poison'] },
  { nombre:'charmander', num:'004', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', tipos:['fire'] },
  { nombre:'squirtle', num:'007', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', tipos:['water'] },
  { nombre:'pikachu', num:'025', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', tipos:['electric'] }
]
</script>
<style scoped>
.home{max-width:1000px;margin:0 auto;padding:2rem}
.hero{background:linear-gradient(135deg,#ff6b6b,#ee5a24);color:#fff;padding:3rem;border-radius:24px;text-align:center;margin-bottom:2rem}
.hero h1{font-size:3rem;margin:0}
.sub{font-size:1.1rem;opacity:.9}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem}
@media(max-width:700px){.grid{grid-template-columns:1fr}}
.card{background:#fff;border-radius:20px;padding:2rem;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.card h3{margin:0 0 1.5rem;font-size:1.3rem;color:#2d3436}
.count{font-size:4rem;font-weight:800;text-align:center;color:#2d3436;transition:.3s}
.count.par{color:#00b894}
.btns{display:flex;gap:.8rem;justify-content:center;margin-top:1.5rem}
.btn{width:60px;height:60px;border:none;border-radius:50%;font-size:2rem;cursor:pointer;transition:.3s;color:#fff;box-shadow:0 4px 15px rgba(0,0,0,.2)}
.menos{background:linear-gradient(135deg,#ff6b6b,#c0392b)}
.mas{background:linear-gradient(135deg,#00b894,#00cec9)}
.reset{background:linear-gradient(135deg,#636e72,#2d3436);font-size:1.5rem}
.btn:hover{transform:scale(1.1)}
.pokemon-section{margin-top:1rem}
.poke-grid{display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center}
</style>
