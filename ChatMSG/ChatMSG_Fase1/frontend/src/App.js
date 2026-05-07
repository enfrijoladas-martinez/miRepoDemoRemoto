import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Conectamos al servidor que corre en el puerto 4000
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000', {
  transports: ['websocket', 'polling'],
});

function App() {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleHistory = (history) => setChat(history);
    const handleReceiveMessage = (msg) => setChat((prev) => [...prev, msg]);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('chat_history', handleHistory);
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('chat_history', handleHistory);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const cleanUser = user.trim();
    const cleanMessage = message.trim();

    if (cleanUser && cleanMessage) {
      socket.emit('send_message', { user: cleanUser, text: cleanMessage });
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>ChatMSG - Fase 1</h2>
      <p style={{ color: isConnected ? 'green' : 'red' }}>
        {isConnected ? 'Conectado al servidor' : 'Sin conexion al servidor'}
      </p>
      <input 
        placeholder="Tu nombre..." 
        value={user}
        onChange={(e) => setUser(e.target.value)} 
      />
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', margin: '10px 0', padding: '10px', background: '#fff' }}>
        {chat.map((m) => (
          <p key={m.id}><strong>{m.user}:</strong> {m.text} <small>{m.time}</small></p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensaje..." />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;
