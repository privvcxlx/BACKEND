const bcrypt = require('bcryptjs');
const { Op, fn, col, where } = require('sequelize');
const { Usuario, MovimientoMoneda } = require('../models');

function mapUser(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    username: usuario.username,
    email: usuario.email,
    telefono: usuario.telefono,
    fecha_nacimiento: usuario.fecha_nacimiento,
    monedas: Number(usuario.monedas || 0),
    puntos: Number(usuario.puntos || 0),
    nivel_actual: usuario.nivel_actual,
    horas_streamer: Number(usuario.horas_streamer || 0)
  };
}

async function checkUsername(req, res) {
  const username = (req.params.username || '').trim().toLowerCase();
  if (!username) {
    return res.status(400).json({ message: 'Username requerido' });
  }

  const exists = await Usuario.findOne({
    where: where(fn('lower', col('username')), username)
  });

  return res.json({ available: !exists });
}

async function registerUser(req, res) {
  try {
    const { nombre, username, email, telefono, fecha_nacimiento, password } = req.body;

    if (!nombre || !password || !username) {
      return res.status(400).json({ message: 'Nombre, username y password son obligatorios' });
    }

    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    const normalizedTelefono = telefono ? String(telefono).trim() : null;

    const existingUser = await Usuario.findOne({
      where: {
        [Op.or]: [
          where(fn('lower', col('username')), normalizedUsername),
          normalizedEmail ? where(fn('lower', col('email')), normalizedEmail) : null,
          normalizedTelefono ? { telefono: normalizedTelefono } : null
        ].filter(Boolean)
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'El usuario, correo o telefono ya existe' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre: String(nombre).trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      telefono: normalizedTelefono,
      fecha_nacimiento: fecha_nacimiento || null,
      password_hash
    });

    return res.status(201).json(mapUser(usuario));
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo registrar el usuario' });
  }
}

async function loginUser(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Credenciales incompletas' });
    }

    const normalized = String(identifier).trim().toLowerCase();

    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          where(fn('lower', col('email')), normalized),
          where(fn('lower', col('username')), normalized)
        ]
      }
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const validPassword = await bcrypt.compare(password, usuario.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    return res.json(mapUser(usuario));
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo iniciar sesion' });
  }
}

async function getUser(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(mapUser(usuario));
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo obtener el usuario' });
  }
}

async function updateUser(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { monedas, puntos, nivel_actual, horas_streamer } = req.body;

    if (monedas !== undefined) usuario.monedas = Number(monedas);
    if (puntos !== undefined) usuario.puntos = Number(puntos);
    if (nivel_actual !== undefined) usuario.nivel_actual = nivel_actual;
    if (horas_streamer !== undefined) usuario.horas_streamer = Number(horas_streamer);

    await usuario.save();

    return res.json({ usuario: mapUser(usuario) });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo actualizar el usuario' });
  }
}

async function purchaseCoins(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const cantidad = Number(req.body.cantidad || 0);

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: 'Cantidad invalida' });
    }

    usuario.monedas = Number(usuario.monedas) + cantidad;
    await usuario.save();

    await MovimientoMoneda.create({
      usuario_id: usuario.id,
      tipo: 'recarga',
      monedas: cantidad,
      puntos: 0,
      metodo_pago: req.body.metodo_pago || null,
      card_last4: req.body.card_last4 || null
    });

    return res.json({ usuario: mapUser(usuario) });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo registrar la recarga' });
  }
}

module.exports = {
  mapUser,
  checkUsername,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  purchaseCoins
};
