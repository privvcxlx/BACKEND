const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Regalo = sequelize.define('Regalo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  icono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  costo_monedas: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  puntos_otorgados: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  creado_por: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'regalos',
  timestamps: true
});

module.exports = Regalo;
