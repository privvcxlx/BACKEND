const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimientoMoneda = sequelize.define('MovimientoMoneda', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  stream_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stream_referencia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  regalo_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  monedas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  puntos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metodo_pago: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  card_last4: {
    type: DataTypes.STRING(4),
    allowNull: true
  }
}, {
  tableName: 'movimientos_monedas',
  timestamps: true
});

module.exports = MovimientoMoneda;
