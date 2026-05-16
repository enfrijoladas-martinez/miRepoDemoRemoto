<template>
  <div class="poke-card">
    <span class="num">#{{num}}</span>
    <div class="img-wrap"><img :src="img" :alt="nombre" /></div>
    <h4>{{nombre}}</h4>
    <div class="tipos"><span v-for="t in tipos" :key="t" :style="{background:colores[t]||'#aaa'}" class="badge">{{t}}</span></div>
  </div>
</template>
<script setup>
defineProps({ nombre:String, img:String, tipos:{type:Array,default:()=>[]}, num:String })
const colores = { grass:'#78C850', poison:'#A040A0', fire:'#F08030', water:'#6890F0', electric:'#F8D030' }
</script>
<style scoped>
.poke-card{background:linear-gradient(145deg,#fff,#f8f9fa);border-radius:20px;padding:1.2rem;text-align:center;width:180px;box-shadow:0 8px 25px rgba(0,0,0,.1);transition:.3s}
.poke-card:hover{transform:translateY(-8px);box-shadow:0 15px 40px rgba(0,0,0,.15)}
.num{font-size:.8rem;color:#999;font-weight:700;display:block;text-align:right}
.img-wrap{background:#f0f0f0;border-radius:50%;width:130px;height:130px;margin:.5rem auto;display:flex;align-items:center;justify-content:center}
.img-wrap img{width:100px;height:100px;object-fit:contain}
h4{text-transform:capitalize;margin:.8rem 0;font-size:1.2rem;color:#2d3436}
.tipos{display:flex;gap:.4rem;justify-content:center}
.badge{padding:.2rem .7rem;border-radius:12px;color:#fff;font-size:.75rem;font-weight:700}
</style>
