const { Categoria, Regalo } = require('../models');

async function seedBasicData() {
  const categories = ['Gaming', 'Música', 'Cocina', 'Arte', 'Charlando'];
  const defaultGifts = [
    { nombre: 'Rosa', icono: '🌹', costo_monedas: 10, puntos_otorgados: 5, creado_por: null },
    { nombre: 'Corazón', icono: '❤️', costo_monedas: 50, puntos_otorgados: 25, creado_por: null },
    { nombre: 'Fuego', icono: '🔥', costo_monedas: 100, puntos_otorgados: 60, creado_por: null },
    { nombre: 'Diamante', icono: '💎', costo_monedas: 500, puntos_otorgados: 300, creado_por: null }
  ];

  for (const nombre of categories) {
    await Categoria.findOrCreate({ where: { nombre } });
  }

  for (const gift of defaultGifts) {
    await Regalo.findOrCreate({
      where: {
        nombre: gift.nombre,
        creado_por: null
      },
      defaults: gift
    });
  }
}

module.exports = seedBasicData;
