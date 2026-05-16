<template>
  <div class="container">
    <div class="card">
      <h1>👋 ¡Hola Mundo!</h1>
      <p class="sub">Proyecto Nuxt.js de <strong>Elías Martínez</strong></p>
      <div class="info">
        <p>Este es mi primer proyecto con Nuxt 3</p>
        <p class="fecha">📅 {{ new Date().toLocaleDateString('es-MX') }}</p>
      </div>
    </div>
  </div>
</template>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh}
.container{display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
.card{background:#fff;padding:3rem;border-radius:24px;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);text-align:center;max-width:500px}
h1{font-size:3rem;margin-bottom:.5rem;color:#2d3436}
.sub{font-size:1.2rem;color:#636e72;margin-bottom:2rem}
.info{background:#f8f9fa;padding:1.5rem;border-radius:16px;color:#2d3436}
.fecha{margin-top:.8rem;color:#667eea;font-weight:600}
</style>
