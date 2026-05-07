# ChatMSG Fase 2

Aplicacion de chat con React, Express, Socket.IO, cookies httpOnly y Redis pub/sub.

## Backend

En CMD:

```cmd
cd C:\Users\elias\trabajo\miRepoDemoRemoto\ChatMSG\ChatMSG_Fase2\backend
set SERVER_ID=elias
set REDIS_USERNAME=default
set REDIS_PASSWORD=dQ5887TeYJp2N30kuyk6OmGn1wocZuwI
set REDIS_HOST=redis-19023.c10.us-east-1-3.ec2.cloud.redislabs.com
set REDIS_PORT=19023
set FRONTEND_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://192.168.8.45:3001
node server.js
```

Tambien se puede usar una sola URL:

```cmd
set REDIS_URL=redis://default:dQ5887TeYJp2N30kuyk6OmGn1wocZuwI@redis-19023.c10.us-east-1-3.ec2.cloud.redislabs.com:19023
```

## Frontend

En otra ventana CMD:

```cmd
cd C:\Users\elias\trabajo\miRepoDemoRemoto\ChatMSG\ChatMSG_Fase2\frontend
set REACT_APP_SOCKET_URL=http://localhost:4000
npm.cmd start
```

## Para dos computadoras

Los dos servidores deben usar el mismo `REDIS_URL` y el mismo canal Redis. No necesitan `PEER_SERVER_URL`; Redis se encarga de publicar y recibir los mensajes entre servidores.

Ejemplo:

- Elias: `SERVER_ID=elias`, frontend en `localhost:3000`, backend en `4000`.
- Companera: `SERVER_ID=companera`, frontend en `192.168.8.45:3001`, backend en `4000`.

Si el frontend de la companera se conecta a su propio backend:

```cmd
set REACT_APP_SOCKET_URL=http://localhost:4000
```

Si el frontend de la companera se conecta al backend de Elias:

```cmd
set REACT_APP_SOCKET_URL=http://IP_DE_ELIAS:4000
```
