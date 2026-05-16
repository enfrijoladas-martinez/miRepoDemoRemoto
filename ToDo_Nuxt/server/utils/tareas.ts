export interface Tarea {
  id: number
  titulo: string
  completada: boolean
  favorita: boolean
}
let tareas: Tarea[] = [
  { id: 1, titulo: 'Estudiar Vue.js', completada: false, favorita: true },
  { id: 2, titulo: 'Hacer ejercicio', completada: false, favorita: false },
  { id: 3, titulo: 'Leer un libro', completada: true, favorita: false }
]
let nextId = 4
export function obtenerTodas() { return tareas }
export function obtenerPorId(id: number) { return tareas.find(t => t.id === id) }
export function crearTarea(titulo: string) { const t: Tarea = { id: nextId++, titulo, completada: false, favorita: false }; tareas.push(t); return t }
export function actualizarTarea(id: number, titulo: string) { const t = tareas.find(x => x.id === id); if (t) t.titulo = titulo; return t }
export function toggleCampo(id: number, campo: 'completada' | 'favorita') { const t = tareas.find(x => x.id === id); if (t) t[campo] = !t[campo]; return t }
export function eliminarTarea(id: number) { tareas = tareas.filter(t => t.id !== id) }
