import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';

function App() {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [serverId, setServerId] = useState('');
  const [connectionError, setConnectionError] = useState('');

  const socket = useMemo(() => io(socketUrl, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'],
  }), []);

  useEffect(() => {
    let isMounted = true;

    const startSession = async () => {
      try {
        const response = await fetch(`${socketUrl}/session`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('No se pudo crear la sesion');
        }

        const data = await response.json();

        if (isMounted) {
          setServerId(data.serverId || '');
          socket.connect();
        }
      } catch (error) {
        if (isMounted) {
          setConnectionError(error.message);
        }
      }
    };

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError('');
    };
    const handleDisconnect = () => setIsConnected(false);
    const handleConnectError = (error) => {
      setIsConnected(false);
      setConnectionError(error.message);
    };
    const handleHistory = (history) => setChat(history);
    const handleReceiveMessage = (msg) => setChat((prev) => [...prev, msg]);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('chat_history', handleHistory);
    socket.on('receive_message', handleReceiveMessage);

    startSession();

    return () => {
      isMounted = false;
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('chat_history', handleHistory);
      socket.off('receive_message', handleReceiveMessage);
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    const cleanUser = user.trim();
    const cleanMessage = message.trim();

    if (cleanUser && cleanMessage && socket.connected) {
      socket.emit('send_message', { user: cleanUser, text: cleanMessage });
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>ChatMSG - Fase 2</h2>
      <p style={{ color: isConnected ? 'green' : 'red' }}>
        {isConnected ? `Conectado al servidor ${serverId}` : 'Sin conexion al servidor'}
      </p>
      {connectionError && <p style={{ color: 'crimson' }}>{connectionError}</p>}
      <input
        placeholder="Tu nombre..."
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', margin: '10px 0', padding: '10px', background: '#fff' }}>
        {chat.map((m) => (
          <p key={m.id}>
            <strong>{m.user}:</strong> {m.text} <small>{m.time} | {m.originServerId || m.server}</small>
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensaje..." />
        <button type="submit" disabled={!isConnected}>Enviar</button>
      </form>
    </div>
  );
}

export default App;
