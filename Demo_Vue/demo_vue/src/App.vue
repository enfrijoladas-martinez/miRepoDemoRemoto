<template>
  <div class="app">
    <nav class="nav"><router-link to="/">Inicio</router-link><router-link to="/about">Acerca</router-link></nav>
    <router-view />
  </div>
</template>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#ffecd2,#fcb69f);min-height:100vh}
.nav{display:flex;gap:1rem;justify-content:center;padding:1.5rem;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.05)}
.nav a{text-decoration:none;color:#ee5a24;font-weight:600;padding:.5rem 1rem;border-radius:8px;transition:.3s}
.nav a:hover{background:#ffecd2}
</style>
