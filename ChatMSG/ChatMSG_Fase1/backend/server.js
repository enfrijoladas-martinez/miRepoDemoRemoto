const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000" }
});

let messages = [];

io.on('connection', (socket) => {
    socket.emit('chat_history', messages);
    socket.on('send_message', (data) => {
        const newMessage = { id: Date.now(), user: data.user, text: data.text, time: new Date().toLocaleTimeString() };
        messages.push(newMessage);
        io.emit('receive_message', newMessage);
    });
});

server.listen(4000, () => {
    console.log('Servidor Fase 1 corriendo en puerto 4000');
});