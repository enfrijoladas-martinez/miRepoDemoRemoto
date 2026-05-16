const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { pool, initDB } = require('./database/db');
let ventana;

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1100, height: 750,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  ventana.loadFile('src/index.html');
}

app.whenReady().then(async () => {
  await initDB();
  crearVentana();
});

// Grupos
ipcMain.handle('grupos:listar', async () => {
  const [rows] = await pool.query('SELECT * FROM grupos ORDER BY created_at DESC');
  return rows;
});
ipcMain.handle('grupos:crear', async (_, { nombre }) => {
  const [r] = await pool.query('INSERT INTO grupos (nombre) VALUES (?)', [nombre]);
  return { id: r.insertId, nombre };
});
ipcMain.handle('grupos:actualizar', async (_, { id, nombre }) => {
  await pool.query('UPDATE grupos SET nombre = ? WHERE id = ?', [nombre, id]);
  return { id, nombre };
});
ipcMain.handle('grupos:eliminar', async (_, { id }) => {
  await pool.query('DELETE FROM grupos WHERE id = ?', [id]);
  return { success: true };
});

// Alumnos
ipcMain.handle('alumnos:listar', async (_, { grupo_id }) => {
  const [rows] = await pool.query('SELECT * FROM alumnos WHERE grupo_id = ? ORDER BY nombre', [grupo_id]);
  return rows;
});
ipcMain.handle('alumnos:crear', async (_, { grupo_id, nombre }) => {
  const [r] = await pool.query('INSERT INTO alumnos (grupo_id, nombre) VALUES (?, ?)', [grupo_id, nombre]);
  return { id: r.insertId, grupo_id, nombre };
});
ipcMain.handle('alumnos:actualizar', async (_, { id, nombre }) => {
  await pool.query('UPDATE alumnos SET nombre = ? WHERE id = ?', [nombre, id]);
  return { id, nombre };
});
ipcMain.handle('alumnos:eliminar', async (_, { id }) => {
  await pool.query('DELETE FROM alumnos WHERE id = ?', [id]);
  return { success: true };
});

// Asistencias
ipcMain.handle('asistencias:listar', async (_, { grupo_id, fecha }) => {
  const [rows] = await pool.query(
    'SELECT a.id, a.nombre, COALESCE(asist.presente,0) AS presente, asist.fecha FROM alumnos a LEFT JOIN asistencias asist ON a.id = asist.alumno_id AND asist.fecha = ? WHERE a.grupo_id = ? ORDER BY a.nombre',
    [fecha, grupo_id]
  );
  return rows;
});
ipcMain.handle('asistencias:marcar', async (_, { alumno_id, fecha, presente }) => {
  await pool.query('INSERT INTO asistencias (alumno_id, fecha, presente) VALUES (?,?,?) ON DUPLICATE KEY UPDATE presente = VALUES(presente)', [alumno_id, fecha, presente]);
  return { success: true };
});
ipcMain.handle('asistencias:resumen', async (_, { grupo_id }) => {
  const [total] = await pool.query('SELECT COUNT(*) AS c FROM alumnos WHERE grupo_id = ?', [grupo_id]);
  const totalAlumnos = total[0].c;
  const [rows] = await pool.query(`
    SELECT a.id, a.nombre, COUNT(asist.alumno_id) AS total_clases, SUM(asist.presente) AS presentes,
      ROUND(SUM(asist.presente)/COUNT(asist.alumno_id)*100,1) AS porcentaje
    FROM alumnos a LEFT JOIN asistencias asist ON a.id = asist.alumno_id WHERE a.grupo_id = ?
    GROUP BY a.id, a.nombre ORDER BY porcentaje ASC`, [grupo_id]);
  const [fechas] = await pool.query('SELECT DISTINCT fecha FROM asistencias WHERE alumno_id IN (SELECT id FROM alumnos WHERE grupo_id = ?) ORDER BY fecha', [grupo_id]);
  return { alumnos: rows, totalAlumnos, fechas };
});
