import { obtenerTodas, crearTarea } from '~/server/utils/tareas'
export default defineEventHandler(async (event) => {
  if (getMethod(event) === 'GET') return obtenerTodas()
  if (getMethod(event) === 'POST') {
    const body = await readBody(event)
    return crearTarea(body.titulo)
  }
})
