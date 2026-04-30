# APIApp Segura

Mini aplicacion para la actividad:

- Consume PokeAPI.
- La unica ruta publica del frontend es `/login`.
- Usa cookie `HttpOnly` para guardar la sesion.
- Protege `/home`, `/detalles` y `/filtran` con un `SecureRoute` en el frontend.
- Mantiene las APIs protegidas en backend para que no se puedan consumir sin sesion.

## Ejecutar

```bash
npm start
```

Luego abre:

```text
http://localhost:3000
```

## Usuario de prueba

```text
usuario: admin
password: 1234
```

Tambien funciona:

```text
usuario: elias
password: 1234
```

## Rutas

- `/login`: publica en el frontend.
- `/home`: protegida por `secureRoute`, lista Pokemon desde PokeAPI.
- `/detalles`: protegida por `secureRoute`, consulta el detalle por nombre o id.
- `/filtran`: protegida por `secureRoute`, filtra la lista recibida desde PokeAPI.

La cookie se crea con `HttpOnly`, `SameSite=Strict` y `Max-Age`. Si el servidor esta detras de HTTPS tambien agrega `Secure`.
