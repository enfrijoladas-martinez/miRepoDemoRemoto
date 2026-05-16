import { obtenerPorId, actualizarTarea, toggleCampo, eliminarTarea } from '~/server/utils/tareas'
export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id')!)
  const method = getMethod(event)
  if (method === 'GET') return obtenerPorId(id)
  if (method === 'PUT') { const body = await readBody(event); return actualizarTarea(id, body.titulo) }
  if (method === 'PATCH') { const query = getQuery(event); return toggleCampo(id, query.campo as 'completada'|'favorita') }
  if (method === 'DELETE') { eliminarTarea(id); return { success: true } }
})
