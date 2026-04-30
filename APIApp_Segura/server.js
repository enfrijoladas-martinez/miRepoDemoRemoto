const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const SESSION_COOKIE = "apiapp_session";
const SESSION_TTL_MS = 1000 * 60 * 60;
const sessions = new Map();

const users = new Map([
  ["admin", { password: "1234", name: "Administrador" }],
  ["elias", { password: "1234", name: "Elias" }]
]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

const protectedPages = new Set(["/home", "/detalles", "/filtran"]);
const publicPages = new Set(["/", "/login"]);

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const index = cookie.indexOf("=");
        return [cookie.slice(0, index), decodeURIComponent(cookie.slice(index + 1))];
      })
  );
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const id = cookies[SESSION_COOKIE];
  const session = id ? sessions.get(id) : null;

  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(id);
    return null;
  }

  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return { id, ...session };
}

function createSession(username) {
  const id = crypto.randomBytes(32).toString("hex");
  sessions.set(id, {
    username,
    name: users.get(username).name,
    expiresAt: Date.now() + SESSION_TTL_MS
  });
  return id;
}

function sessionCookie(id, req) {
  const secure = req.headers["x-forwarded-proto"] === "https" || req.socket.encrypted;
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(id)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${SESSION_TTL_MS / 1000}`
  ];

  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

function send(res, statusCode, body, contentType = "text/plain; charset=utf-8", headers = {}) {
  res.writeHead(statusCode, { "Content-Type": contentType, ...headers });
  res.end(body);
}

function sendJson(res, statusCode, data, headers = {}) {
  send(res, statusCode, JSON.stringify(data), "application/json; charset=utf-8", headers);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Archivo no encontrado");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, mimeTypes[ext] || "application/octet-stream");
  });
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

async function fetchPokemonList(limit = 24) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!response.ok) throw new Error("No se pudo consultar PokeAPI");
  const data = await response.json();

  return data.results.map((pokemon, index) => {
    const id = index + 1;
    return {
      id,
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    };
  });
}

async function fetchPokemonDetail(nameOrId) {
  const safeValue = encodeURIComponent(String(nameOrId || "").toLowerCase().trim());
  if (!safeValue) return null;

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${safeValue}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("No se pudo consultar el detalle");

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
    types: data.types.map((item) => item.type.name),
    abilities: data.abilities.map((item) => item.ability.name),
    stats: data.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat
    }))
  };
}

function requireApiAuth(req, res) {
  const session = getSession(req);
  if (!session) {
    sendJson(res, 401, { ok: false, message: "Sesion requerida" });
    return null;
  }
  return session;
}

async function handleApi(req, res, pathname) {
  if (pathname === "/api/login" && req.method === "POST") {
    try {
      const { username, password } = await readJsonBody(req);
      const user = users.get(String(username || "").toLowerCase());

      if (!user || user.password !== password) {
        sendJson(res, 401, { ok: false, message: "Usuario o password incorrectos" });
        return;
      }

      const sessionId = createSession(String(username).toLowerCase());
      sendJson(res, 200, { ok: true, redirectTo: "/home" }, {
        "Set-Cookie": sessionCookie(sessionId, req)
      });
    } catch {
      sendJson(res, 400, { ok: false, message: "Solicitud invalida" });
    }
    return;
  }

  if (pathname === "/api/logout" && req.method === "POST") {
    const session = getSession(req);
    if (session) sessions.delete(session.id);
    sendJson(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
    return;
  }

  const session = requireApiAuth(req, res);
  if (!session) return;

  if (pathname === "/api/session" && req.method === "GET") {
    sendJson(res, 200, { ok: true, user: { username: session.username, name: session.name } });
    return;
  }

  if (pathname === "/api/pokemon" && req.method === "GET") {
    try {
      const list = await fetchPokemonList();
      sendJson(res, 200, { ok: true, pokemon: list });
    } catch (error) {
      sendJson(res, 502, { ok: false, message: error.message });
    }
    return;
  }

  if (pathname === "/api/pokemon/detail" && req.method === "GET") {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pokemon = await fetchPokemonDetail(url.searchParams.get("name"));

      if (!pokemon) {
        sendJson(res, 404, { ok: false, message: "Pokemon no encontrado" });
        return;
      }

      sendJson(res, 200, { ok: true, pokemon });
    } catch (error) {
      sendJson(res, 502, { ok: false, message: error.message });
    }
    return;
  }

  sendJson(res, 404, { ok: false, message: "Endpoint no encontrado" });
}

function handlePage(req, res, pathname) {
  const session = getSession(req);

  if (protectedPages.has(pathname) && !session) {
    redirect(res, "/login");
    return;
  }

  if (publicPages.has(pathname) && session) {
    redirect(res, "/home");
    return;
  }

  if (publicPages.has(pathname) || protectedPages.has(pathname)) {
    serveFile(res, path.join(PUBLIC_DIR, "index.html"));
    return;
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    send(res, 403, "Acceso denegado");
    return;
  }

  serveFile(res, filePath);
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname.startsWith("/api/")) {
    await handleApi(req, res, pathname);
    return;
  }

  handlePage(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`APIApp Segura lista en http://localhost:${PORT}`);
});
