const API = "http://localhost:3000/api/usuarios";
const tabla = document.getElementById("tabla");
const form = document.getElementById("formulario");

async function cargar() {
  const res = await fetch(API);
  const data = await res.json();
  tabla.innerHTML = data.map(u => `<tr onclick="seleccionar(${u.id})"><td>${u.nombre}</td><td>${u.email}</td><td>${u.genero}</td><td>${u.servicios.join(', ')}</td></tr>`).join('');
}

function obtenerServicios() {
  return [...document.querySelectorAll('.servicio:checked')].map(c => c.value);
}

function seleccionar(id) {
  fetch(API).then(r=>r.json()).then(data => {
    const u = data.find(d => d.id === id);
    if(!u) return;
    document.getElementById('id').value = u.id;
    document.getElementById('nombre').value = u.nombre;
    document.getElementById('email').value = u.email;
    document.getElementById('genero').value = u.genero;
    document.querySelectorAll('.servicio').forEach(c => c.checked = u.servicios.includes(c.value));
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const body = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    genero: document.getElementById('genero').value,
    servicios: obtenerServicios()
  };
  if (id) await fetch(`${API}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  else await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  form.reset();
  document.getElementById('id').value = '';
  cargar();
});

cargar();
