export default function Dashboard({ user, onLogout }) {
  return (
    <div className="dashboard">
      <div className="dash-card">
        <h1>👋 Bienvenido, {user?.username || 'Usuario'}</h1>
        <p>Has iniciado sesión correctamente.</p>
        <button onClick={onLogout} className="logout">Cerrar Sesión</button>
      </div>
    </div>
  )
}
