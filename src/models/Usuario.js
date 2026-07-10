const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: true,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: true,
    unique: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  monedas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  puntos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  nivel_actual: {
    type: DataTypes.STRING(40),
    allowNull: false,
    defaultValue: 'Bronce'
  },
  horas_streamer: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;
