const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MensajeChat = sequelize.define('MensajeChat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  stream_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stream_referencia: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  alias: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nivel: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'mensajes_chat',
  timestamps: true
});

module.exports = MensajeChat;
