# APIApp Segura

Mini aplicacion para la actividad:

- Consume PokeAPI.
- La unica ruta publica es `/login`.
- Usa cookie `HttpOnly` para guardar la sesion.
- Protege `/home`, `/detalles` y `/filtran` desde el servidor.

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

- `/login`: publica.
- `/home`: protegida, lista Pokemon desde PokeAPI.
- `/detalles`: protegida, consulta el detalle por nombre o id.
- `/filtran`: protegida, filtra la lista recibida desde PokeAPI.

La cookie se crea con `HttpOnly`, `SameSite=Strict` y `Max-Age`. Si el servidor esta detras de HTTPS tambien agrega `Secure`.
