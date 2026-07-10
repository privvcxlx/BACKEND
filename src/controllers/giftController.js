const { Regalo } = require('../models');

async function getGifts(req, res) {
  try {
    const userId = req.params.userId;

    const custom = await Regalo.findAll({
      where: { creado_por: userId },
      order: [['id', 'ASC']]
    });

    const defaults = await Regalo.findAll({
      where: { creado_por: null },
      order: [['id', 'ASC']]
    });

    return res.json({ custom, defaults });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudieron obtener los regalos' });
  }
}

async function createGift(req, res) {
  try {
    const { nombre, icono, costo_monedas, puntos_otorgados, creado_por } = req.body;

    if (!nombre || !icono || !costo_monedas || !puntos_otorgados || !creado_por) {
      return res.status(400).json({ message: 'Datos incompletos para crear el regalo' });
    }

    const regalo = await Regalo.create({
      nombre: String(nombre).trim(),
      icono: String(icono).trim(),
      costo_monedas: Number(costo_monedas),
      puntos_otorgados: Number(puntos_otorgados),
      creado_por
    });

    return res.status(201).json(regalo);
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo crear el regalo' });
  }
}

async function updateGift(req, res) {
  try {
    const regalo = await Regalo.findByPk(req.params.id);

    if (!regalo) {
      return res.status(404).json({ message: 'Regalo no encontrado' });
    }

    const { nombre, icono, costo_monedas, puntos_otorgados } = req.body;

    if (nombre !== undefined) regalo.nombre = String(nombre).trim();
    if (icono !== undefined) regalo.icono = String(icono).trim();
    if (costo_monedas !== undefined) regalo.costo_monedas = Number(costo_monedas);
    if (puntos_otorgados !== undefined) regalo.puntos_otorgados = Number(puntos_otorgados);

    await regalo.save();

    return res.json(regalo);
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo actualizar el regalo' });
  }
}

async function deleteGift(req, res) {
  try {
    const regalo = await Regalo.findByPk(req.params.id);

    if (!regalo) {
      return res.status(404).json({ message: 'Regalo no encontrado' });
    }

    await regalo.destroy();

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo eliminar el regalo' });
  }
}

module.exports = {
  getGifts,
  createGift,
  updateGift,
  deleteGift
};
