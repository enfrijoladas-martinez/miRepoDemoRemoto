const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  grupos: {
    listar: () => ipcRenderer.invoke('grupos:listar'),
    crear: n => ipcRenderer.invoke('grupos:crear', { nombre: n }),
    actualizar: (id, n) => ipcRenderer.invoke('grupos:actualizar', { id, nombre: n }),
    eliminar: id => ipcRenderer.invoke('grupos:eliminar', { id })
  },
  alumnos: {
    listar: g => ipcRenderer.invoke('alumnos:listar', { grupo_id: g }),
    crear: (g, n) => ipcRenderer.invoke('alumnos:crear', { grupo_id: g, nombre: n }),
    actualizar: (id, n) => ipcRenderer.invoke('alumnos:actualizar', { id, nombre: n }),
    eliminar: id => ipcRenderer.invoke('alumnos:eliminar', { id })
  },
  asistencias: {
    listar: (g, f) => ipcRenderer.invoke('asistencias:listar', { grupo_id: g, fecha: f }),
    marcar: (a, f, p) => ipcRenderer.invoke('asistencias:marcar', { alumno_id: a, fecha: f, presente: p }),
    resumen: g => ipcRenderer.invoke('asistencias:resumen', { grupo_id: g })
  }
});
