require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');
const seedBasicData = require('./config/seedBasicData');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Backend activo' });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', routes);

app.use((err, _req, res, _next) => {
  return res.status(500).json({ message: err.message || 'Error interno del servidor' });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedBasicData();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el backend');
    console.error(error.message);
  }
}

startServer();
