const crypto = require('crypto');
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 4000;
const SERVER_ID = process.env.SERVER_ID || `server-${PORT}`;
const REDIS_URL = process.env.REDIS_URL || null;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const REDIS_USERNAME = process.env.REDIS_USERNAME || undefined;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
const SESSION_COOKIE = 'chatmsg_session';
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: corsOptions.origin,
        credentials: true,
        methods: ['GET', 'POST']
    }
});

const messages = [];
const deliveredMessageIds = new Set();
const redisOptions = REDIS_URL
    ? { url: REDIS_URL }
    : {
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
        socket: {
            host: REDIS_HOST,
            port: REDIS_PORT
        }
    };
const publisher = createClient(redisOptions);
const subscriber = publisher.duplicate();

function createSessionId() {
    return crypto.randomBytes(24).toString('hex');
}

function rememberMessage(id) {
    deliveredMessageIds.add(id);

    if (deliveredMessageIds.size > 1000) {
        const firstId = deliveredMessageIds.values().next().value;
        deliveredMessageIds.delete(firstId);
    }
}

function normalizeMessage(data) {
    const user = String(data.user || '').trim();
    const text = String(data.text || '').trim();

    if (!user || !text) {
        return null;
    }

    return {
        id: data.id || `${Date.now()}-${SERVER_ID}-${crypto.randomUUID()}`,
        user,
        text,
        time: data.time || new Date().toLocaleTimeString(),
        originServerId: data.originServerId || SERVER_ID
    };
}

function saveAndBroadcast(message) {
    if (deliveredMessageIds.has(message.id)) {
        return false;
    }

    rememberMessage(message.id);
    messages.push(message);
    io.emit('receive_message', message);
    console.log(`[${message.originServerId}] ${message.user}: ${message.text}`);
    return true;
}

app.get('/', (req, res) => {
    res.send(`Servidor ChatMSG Fase 2 activo (${SERVER_ID})`);
});

app.get('/session', (req, res) => {
    const sessionId = req.cookies[SESSION_COOKIE] || createSessionId();

    res.cookie(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 8
    });

    res.json({ ok: true, serverId: SERVER_ID });
});

io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie || '';
    const hasSessionCookie = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .some((part) => part.startsWith(`${SESSION_COOKIE}=`));

    if (!hasSessionCookie) {
        next(new Error('Falta cookie de sesion. Abre /session antes de conectar el socket.'));
        return;
    }

    next();
});

io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.emit('chat_history', messages);

    socket.on('send_message', (data) => {
        const message = normalizeMessage({
            ...data,
            originServerId: SERVER_ID
        });

        if (!message) {
            return;
        }

        saveAndBroadcast(message);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

async function startRedis() {
    publisher.on('error', (error) => {
        console.error(`Redis publisher: ${error.message}`);
    });

    subscriber.on('error', (error) => {
        console.error(`Redis subscriber: ${error.message}`);
    });

    await publisher.connect();
    await subscriber.connect();

    io.adapter(createAdapter(publisher, subscriber));

    console.log(`Conectado a Redis: ${REDIS_URL || `${REDIS_HOST}:${REDIS_PORT}`}`);
    console.log('Redis Adapter de Socket.IO activo');
}

startRedis()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Servidor ${SERVER_ID} corriendo en puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`No se pudo iniciar Redis: ${error.message}`);
        console.error('Configura REDIS_URL o REDIS_HOST/REDIS_PORT/REDIS_USERNAME/REDIS_PASSWORD con el Redis remoto de la actividad.');
        process.exit(1);
    });
