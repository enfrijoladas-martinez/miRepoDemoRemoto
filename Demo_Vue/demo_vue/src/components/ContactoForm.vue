<template>
  <div><h3>Formulario de Contacto</h3>
    <div class="form-grupo"><label>Nombre</label><input v-model="nombre" placeholder="Tu nombre" /></div>
    <div class="form-grupo"><label>Mensaje</label><textarea v-model="mensaje" placeholder="Escribe algo..."></textarea></div>
    <p class="vista-previa"><strong>{{nombre || 'Anónimo'}}</strong>: {{mensaje || '...'}}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const nombre = ref('')
const mensaje = ref('')
</script>
<style scoped>
.form-grupo{margin-bottom:1rem}
label{display:block;font-size:.9rem;font-weight:600;color:#636e72;margin-bottom:.3rem}
input,textarea{width:100%;padding:.7rem;border:2px solid #dfe6e9;border-radius:10px;font-size:1rem;outline:none;transition:.3s}
input:focus,textarea:focus{border-color:#ee5a24}
textarea{resize:vertical;min-height:60px}
.vista-previa{margin-top:1rem;padding:.8rem;background:#f8f9fa;border-radius:10px;font-style:italic}
</style>
