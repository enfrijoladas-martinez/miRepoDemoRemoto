<script setup lang="ts">
interface Tarea { id: number; titulo: string; completada: boolean; favorita: boolean }
const tareas = ref<Tarea[]>([])
const nuevoTitulo = ref('')
const editandoId = ref<number | null>(null)
const editandoTexto = ref('')
const filtro = ref('todas')

const total = computed(() => tareas.value.length)
const completadas = computed(() => tareas.value.filter(t => t.completada).length)
const porcentaje = computed(() => total.value > 0 ? Math.round(completadas.value / total.value * 100) : 0)
const filtradas = computed(() => {
  if (filtro.value === 'favoritas') return tareas.value.filter(t => t.favorita)
  if (filtro.value === 'completadas') return tareas.value.filter(t => t.completada)
  if (filtro.value === 'pendientes') return tareas.value.filter(t => !t.completada)
  return tareas.value
})

async function cargar() { tareas.value = await $fetch('/api/tareas') }
async function agregar() {
  if (!nuevoTitulo.value.trim()) return
  const t = await $fetch('/api/tareas', { method: 'POST', body: { titulo: nuevoTitulo.value } })
  tareas.value.push(t)
  nuevoTitulo.value = ''
}
async function eliminar(id: number) {
  await $fetch(`/api/tareas/${id}`, { method: 'DELETE' })
  tareas.value = tareas.value.filter(t => t.id !== id)
}
async function toggleFav(id: number) {
  const t = await $fetch(`/api/tareas/${id}`, { method: 'PATCH', params: { campo: 'favorita' } })
  const i = tareas.value.findIndex(x => x.id === id)
  if (i !== -1) tareas.value[i] = t
}
async function toggleComp(id: number) {
  const t = await $fetch(`/api/tareas/${id}`, { method: 'PATCH', params: { campo: 'completada' } })
  const i = tareas.value.findIndex(x => x.id === id)
  if (i !== -1) tareas.value[i] = t
}
function editar(t: Tarea) { editandoId.value = t.id; editandoTexto.value = t.titulo }
async function guardar(id: number) {
  if (!editandoTexto.value.trim()) return
  const t = await $fetch(`/api/tareas/${id}`, { method: 'PUT', body: { titulo: editandoTexto.value } })
  const i = tareas.value.findIndex(x => x.id === id)
  if (i !== -1) tareas.value[i] = t
  editandoId.value = null
  editandoTexto.value = ''
}
function cancelarEdicion() { editandoId.value = null; editandoTexto.value = '' }
onMounted(cargar)
</script>

<template>
  <div class="app">
    <div class="card">
      <header class="header">
        <div class="header-top"><h1>📝 Mis Tareas</h1><span class="badge">{{ completadas }}/{{ total }}</span></div>
        <div class="barra"><div class="relleno" :style="{ width: porcentaje + '%' }"></div></div>
      </header>
      <div class="input-row">
        <input v-model="nuevoTitulo" @keyup.enter="agregar" placeholder="Nueva tarea..." />
        <button @click="agregar" class="add-btn">+</button>
      </div>
      <div class="filtros">
        <button v-for="f in [{k:'todas',l:'Todas'},{k:'pendientes',l:'Pendientes'},{k:'completadas',l:'Completadas'},{k:'favoritas',l:'Favoritas'}]" :key="f.k" :class="['filtro',{activo:filtro===f.k}]" @click="filtro=f.k">{{ f.l }}</button>
      </div>
      <ul class="lista">
        <li v-for="t in filtradas" :key="t.id" :class="{hecha:t.completada,fav:t.favorita}">
          <template v-if="editandoId===t.id">
            <input v-model="editandoTexto" @keyup.enter="guardar(t.id)" class="edit-input" />
            <div class="edit-btns">
              <button @click="guardar(t.id)" class="ok-btn">✓</button>
              <button @click="cancelarEdicion" class="no-btn">✕</button>
            </div>
          </template>
          <template v-else>
            <div class="info" @click="toggleComp(t.id)">
              <div :class="['check',{on:t.completada}]"><span v-if="t.completada">✓</span></div>
              <span class="titulo">{{ t.titulo }}</span>
            </div>
            <div class="acciones">
              <button @click.stop="editar(t)" class="action edit" title="Editar">✏️</button>
              <button @click.stop="toggleFav(t.id)" :class="['action','fav',{on:t.favorita}]" title="Favorita">⭐</button>
              <button @click.stop="eliminar(t.id)" class="action delete" title="Eliminar">🗑️</button>
            </div>
          </template>
        </li>
      </ul>
      <div v-if="filtradas.length===0" class="vacio"><p>No hay tareas que mostrar</p></div>
    </div>
  </div>
</template>

<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;padding:20px}
.app{display:flex;justify-content:center;padding-top:40px}
.card{width:100%;max-width:520px;background:#fff;border-radius:24px;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);overflow:hidden}
.header{padding:24px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}
.header-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.header h1{font-size:24px}
.badge{background:rgba(255,255,255,.2);padding:4px 12px;border-radius:20px;font-size:14px}
.barra{height:8px;background:rgba(255,255,255,.3);border-radius:4px;overflow:hidden}
.relleno{height:100%;background:#fff;border-radius:4px;transition:width .5s}
.input-row{display:flex;gap:12px;padding:20px 24px;background:#f8fafc}
.input-row input{flex:1;padding:14px 18px;border:2px solid #e2e8f0;border-radius:14px;font-size:15px;outline:none}
.input-row input:focus{border-color:#667eea}
.add-btn{width:52px;height:52px;border:none;border-radius:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:28px;cursor:pointer;transition:.3s}
.add-btn:hover{transform:scale(1.05);box-shadow:0 8px 20px rgba(102,126,234,.4)}
.filtros{display:flex;gap:8px;padding:0 24px 16px;flex-wrap:wrap}
.filtro{padding:8px 14px;border:none;border-radius:20px;background:#f1f5f9;color:#64748b;font-size:13px;font-weight:600;cursor:pointer;transition:.3s}
.filtro:hover{background:#e2e8f0}
.filtro.activo{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}
.lista{list-style:none;padding:0 16px 24px}
.lista li{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;margin-bottom:10px;background:#f8fafc;border-radius:14px;transition:.3s}
.lista li:hover{background:#f1f5f9;transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.05)}
.lista li.hecha .titulo{text-decoration:line-through;color:#94a3b8}
.lista li.fav{border-left:4px solid #fbbf24}
.info{display:flex;align-items:center;gap:14px;flex:1;cursor:pointer}
.check{width:24px;height:24px;border:2px solid #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.3s}
.check.on{background:linear-gradient(135deg,#667eea,#764ba2);border-color:#667eea;color:#fff}
.titulo{font-size:15px;color:#334155;font-weight:500}
.acciones{display:flex;gap:6px;opacity:0;transition:opacity .3s}
.lista li:hover .acciones{opacity:1}
.action{width:32px;height:32px;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.3s;background:#f1f5f9}
.action.edit:hover{background:#0284c7;color:#fff}
.action.fav.on{background:#fbbf24}
.action.fav:hover{background:#f59e0b}
.action.delete:hover{background:#dc2626;color:#fff}
.edit-input{flex:1;padding:10px 14px;border:2px solid #667eea;border-radius:10px;font-size:14px;outline:none}
.edit-btns{display:flex;gap:6px}
.ok-btn{width:32px;height:32px;border:none;border-radius:8px;cursor:pointer;background:#22c55e;color:#fff;font-weight:bold}
.no-btn{width:32px;height:32px;border:none;border-radius:8px;cursor:pointer;background:#ef4444;color:#fff;font-weight:bold}
.vacio{text-align:center;padding:40px;color:#94a3b8}
</style>
