const app = document.querySelector("#app");

const routes = {
  "/login": renderLogin,
  "/home": renderHome,
  "/detalles": renderDetails,
  "/filtran": renderFilter
};

const protectedRoutes = new Set(["/home", "/detalles", "/filtran"]);
let sessionCache = null;

function titleCase(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error de solicitud");
  return data;
}

function navigate(path) {
  window.history.pushState({}, "", path);
  renderRoute();
}

function replaceRoute(path) {
  window.history.replaceState({}, "", path);
  renderRoute();
}

function showLoading(message = "Validando sesion...") {
  app.innerHTML = `
    <main class="login-page">
      <section class="login-panel single-panel">
        <h1>APIApp Segura</h1>
        <p class="muted">${message}</p>
      </section>
    </main>
  `;
}

async function getCurrentSession(force = false) {
  if (sessionCache && !force) return sessionCache;
  const session = await api("/api/session");
  sessionCache = session.user;
  return sessionCache;
}

async function secureRoute(view) {
  showLoading();

  try {
    const user = await getCurrentSession();
    view(user);
  } catch {
    sessionCache = null;
    replaceRoute("/login");
  }
}

function layout(content) {
  app.innerHTML = `
    <header class="topbar">
      <a class="brand" href="/home" data-link>
        <span class="brand-mark">A</span>
        <span>APIApp Segura</span>
      </a>
      <nav class="nav">
        <a href="/home" data-link>Home</a>
        <a href="/detalles" data-link>Detalles</a>
        <a href="/filtran" data-link>Filtran</a>
        <button class="ghost-button" id="logoutButton" type="button">Salir</button>
      </nav>
    </header>
    <main class="shell">${content}</main>
  `;

  document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    await api("/api/logout", { method: "POST" });
    sessionCache = null;
    window.location.href = "/login";
  });

  bindLinks();
}

function bindLinks() {
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    });
  });
}

function renderLogin() {
  app.innerHTML = `
    <main class="login-page">
      <section class="login-panel">
        <div>
          <p class="eyebrow">Ruta publica /login</p>
          <h1>APIApp Segura</h1>
          <p class="muted">Inicia sesion para consultar PokeAPI en rutas protegidas por cookie HttpOnly.</p>
        </div>
        <form id="loginForm" class="login-form">
          <label>
            Usuario
            <input name="username" autocomplete="username" value="admin" required>
          </label>
          <label>
            Password
            <input name="password" type="password" autocomplete="current-password" value="1234" required>
          </label>
          <button class="primary-button" type="submit">Entrar</button>
          <p class="hint">Prueba: admin / 1234</p>
          <p class="error" id="loginError" role="alert"></p>
        </form>
      </section>
    </main>
  `;

  document.querySelector("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const error = document.querySelector("#loginError");
    error.textContent = "";

    try {
      const data = await api("/api/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData))
      });
      window.location.href = data.redirectTo;
    } catch (requestError) {
      error.textContent = requestError.message;
    }
  });
}

async function renderHome(user) {
  layout(`
    <section class="hero">
      <div>
        <p class="eyebrow">Ruta protegida /home</p>
        <h1>Explora Pokemon con sesion segura</h1>
        <p class="muted">Esta pantalla solo carga cuando SecureRoute valida la sesion desde el frontend.</p>
      </div>
      <div class="session-pill" id="sessionBox">Sesion: ${user.name}</div>
    </section>
    <section>
      <div class="section-heading">
        <h2>Pokemon iniciales</h2>
        <a class="inline-link" href="/detalles" data-link>Ver detalles</a>
      </div>
      <div class="grid" id="pokemonGrid">
        <p class="muted">Cargando PokeAPI...</p>
      </div>
    </section>
  `);

  try {
    const list = await api("/api/pokemon");
    document.querySelector("#pokemonGrid").innerHTML = list.pokemon
      .map((pokemon) => pokemonCard(pokemon))
      .join("");
  } catch (error) {
    showAuthError(error);
  }
}

function pokemonCard(pokemon) {
  return `
    <article class="pokemon-card">
      <img src="${pokemon.image}" alt="${titleCase(pokemon.name)}">
      <div>
        <span>#${String(pokemon.id).padStart(3, "0")}</span>
        <h3>${titleCase(pokemon.name)}</h3>
      </div>
    </article>
  `;
}

function renderDetails() {
  layout(`
    <section class="page-heading">
      <p class="eyebrow">Ruta protegida /detalles</p>
      <h1>Detalle de Pokemon</h1>
      <p class="muted">Busca por nombre o numero. Ejemplo: pikachu, charizard o 25.</p>
    </section>
    <form class="search-row" id="detailForm">
      <input name="name" value="pikachu" placeholder="Nombre o id" required>
      <button class="primary-button" type="submit">Buscar</button>
    </form>
    <section id="detailResult"></section>
  `);

  document.querySelector("#detailForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    await loadDetail(name);
  });

  loadDetail("pikachu");
}

async function loadDetail(name) {
  const result = document.querySelector("#detailResult");
  result.innerHTML = `<p class="muted">Buscando...</p>`;

  try {
    const { pokemon } = await api(`/api/pokemon/detail?name=${encodeURIComponent(name)}`);
    result.innerHTML = `
      <article class="detail-card">
        <img src="${pokemon.image}" alt="${titleCase(pokemon.name)}">
        <div>
          <p class="eyebrow">#${String(pokemon.id).padStart(3, "0")}</p>
          <h2>${titleCase(pokemon.name)}</h2>
          <p class="muted">Altura: ${pokemon.height} | Peso: ${pokemon.weight}</p>
          <div class="tag-row">${pokemon.types.map((type) => `<span>${type}</span>`).join("")}</div>
          <h3>Habilidades</h3>
          <p>${pokemon.abilities.map(titleCase).join(", ")}</p>
          <h3>Stats</h3>
          <div class="stats">
            ${pokemon.stats.map((stat) => `
              <label>
                <span>${titleCase(stat.name)}</span>
                <meter max="160" value="${stat.value}"></meter>
              </label>
            `).join("")}
          </div>
        </div>
      </article>
    `;
  } catch (error) {
    result.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

async function renderFilter() {
  layout(`
    <section class="page-heading">
      <p class="eyebrow">Ruta protegida /filtran</p>
      <h1>Filtrar Pokemon</h1>
      <p class="muted">La lista viene de PokeAPI y el filtro corre en el cliente.</p>
    </section>
    <div class="search-row">
      <input id="filterInput" placeholder="Filtra por nombre, por ejemplo: saur">
    </div>
    <section class="grid" id="filterGrid">
      <p class="muted">Cargando...</p>
    </section>
  `);

  try {
    const { pokemon } = await api("/api/pokemon");
    const input = document.querySelector("#filterInput");
    const grid = document.querySelector("#filterGrid");

    function paint() {
      const query = input.value.trim().toLowerCase();
      const filtered = pokemon.filter((item) => item.name.includes(query));
      grid.innerHTML = filtered.length
        ? filtered.map((item) => pokemonCard(item)).join("")
        : `<p class="muted">Sin resultados.</p>`;
    }

    input.addEventListener("input", paint);
    paint();
  } catch (error) {
    showAuthError(error);
  }
}

function showAuthError(error) {
  app.innerHTML = `
    <main class="login-page">
      <section class="login-panel">
        <h1>Sesion requerida</h1>
        <p class="muted">${error.message}</p>
        <a class="primary-button" href="/login">Ir a login</a>
      </section>
    </main>
  `;
}

async function renderRoute() {
  let pathname = window.location.pathname;

  if (pathname === "/") {
    window.history.replaceState({}, "", "/login");
    pathname = "/login";
  }

  const view = routes[pathname] || renderLogin;

  if (protectedRoutes.has(pathname)) {
    await secureRoute(view);
    return;
  }

  if (pathname === "/login") {
    try {
      await getCurrentSession();
      replaceRoute("/home");
      return;
    } catch {
      sessionCache = null;
    }
  }

  view();
}

window.addEventListener("popstate", renderRoute);
renderRoute();
