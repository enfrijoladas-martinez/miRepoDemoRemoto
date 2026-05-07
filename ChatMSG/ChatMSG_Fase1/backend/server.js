const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { io: Client } = require('socket.io-client');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const SERVER_ID = process.env.SERVER_ID || `server-${PORT}`;
const peerServerUrls = (process.env.PEER_SERVER_URLS || process.env.PEER_SERVER_URL || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
];

app.use(cors({ origin: allowedOrigins }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

let messages = [];
const deliveredMessageIds = new Set();
const peerSockets = new Set();

function rememberMessage(id) {
    deliveredMessageIds.add(id);

    if (deliveredMessageIds.size > 1000) {
        const firstId = deliveredMessageIds.values().next().value;
        deliveredMessageIds.delete(firstId);
    }
}

function normalizeIncomingMessage(data) {
    const user = String(data.user || '').trim();
    const text = String(data.text || '').trim();

    if (!user || !text) {
        return null;
    }

    return {
        id: data.id || `${Date.now()}-${SERVER_ID}`,
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

function sendToPeerServers(message) {
    peerSockets.forEach((peerSocket) => {
        if (peerSocket.connected) {
            peerSocket.emit('server_message', message);
        }
    });
}

app.get('/', (req, res) => {
    res.send(`Servidor ChatMSG activo (${SERVER_ID})`);
});

io.on('connection', (socket) => {
    const peerServerId = socket.handshake.auth && socket.handshake.auth.serverId;
    console.log(`${peerServerId ? 'Servidor' : 'Cliente'} conectado: ${peerServerId || socket.id}`);

    if (peerServerId) {
        peerSockets.add(socket);
    }

    socket.emit('chat_history', messages);

    socket.on('send_message', (data) => {
        const message = normalizeIncomingMessage({
            ...data,
            id: `${Date.now()}-${SERVER_ID}-${socket.id}`,
            originServerId: SERVER_ID
        });

        if (!message) {
            return;
        }

        if (saveAndBroadcast(message)) {
            sendToPeerServers(message);
        }
    });

    socket.on('server_message', (data) => {
        const message = normalizeIncomingMessage(data);

        if (!message || message.originServerId === SERVER_ID) {
            return;
        }

        if (saveAndBroadcast(message)) {
            sendToPeerServers(message);
        }
    });

    socket.on('disconnect', () => {
        if (peerServerId) {
            peerSockets.delete(socket);
        }

        console.log(`${peerServerId ? 'Servidor' : 'Cliente'} desconectado: ${peerServerId || socket.id}`);
    });
});

peerServerUrls.forEach((peerServerUrl) => {
    const peerSocket = Client(peerServerUrl, {
        auth: { serverId: SERVER_ID },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        transports: ['websocket', 'polling']
    });

    peerSocket.on('connect', () => {
        console.log(`Conectado al servidor remoto: ${peerServerUrl}`);
    });

    peerSocket.on('connect_error', (error) => {
        console.log(`No se pudo conectar con ${peerServerUrl}: ${error.message}`);
    });

    peerSocket.on('server_message', (data) => {
        const message = normalizeIncomingMessage(data);

        if (!message || message.originServerId === SERVER_ID) {
            return;
        }

        if (saveAndBroadcast(message)) {
            sendToPeerServers(message);
        }
    });

    peerSockets.add(peerSocket);
});

server.listen(PORT, () => {
    console.log(`Servidor ${SERVER_ID} corriendo en puerto ${PORT}`);
    if (peerServerUrls.length === 0) {
        console.log('Sin servidor remoto configurado. Usa PEER_SERVER_URL=http://IP_DEL_COMPANERO:PUERTO');
    }
});
