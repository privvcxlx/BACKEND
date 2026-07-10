# BACKEND

## Requisitos

- Node.js
- PostgreSQL

## Estructura

```text
BACKEND/
  src/
    config/
    controllers/
    models/
    routes/
    utils/
    app.js
  sql/
    schema.sql
    seed.sql
  .env.example
  package.json
```

## Instalación

1. Crear una base de datos en PostgreSQL con el nombre que se defina en `.env`.
2. Copiar `.env.example` a `.env`.
3. Ejecutar `npm install`.
4. Ejecutar `npm run dev`.

## Variables

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proyecto_integrador
DB_USER=postgres
DB_PASSWORD=123456
FRONTEND_URL=http://localhost:5173
```

## SQL

- `sql/schema.sql` crea las tablas.
- `sql/seed.sql` inserta categorías y regalos por defecto.

## Frontend

En el frontend crear un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```
