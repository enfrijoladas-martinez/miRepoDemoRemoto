import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Conectamos al servidor que corre en el puerto 4000
const socket = io('http://localhost:4000');

function App() {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('chat_history', (history) => setChat(history));
    socket.on('receive_message', (msg) => setChat((prev) => [...prev, msg]));
    return () => socket.off();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (user && message) {
      socket.emit('send_message', { user, text: message });
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>ChatMSG - Fase 1</h2>
      <input 
        placeholder="Tu nombre..." 
        value={user}
        onChange={(e) => setUser(e.target.value)} 
      />
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', margin: '10px 0', padding: '10px', background: '#fff' }}>
        {chat.map((m) => (
          <p key={m.id}><strong>{m.user}:</strong> {m.text}</p>
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