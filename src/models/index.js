const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Regalo = require('./Regalo');
const Stream = require('./Stream');
const MensajeChat = require('./MensajeChat');
const MovimientoMoneda = require('./MovimientoMoneda');

Usuario.hasMany(Regalo, { foreignKey: 'creado_por', as: 'regalos_personalizados' });
Regalo.belongsTo(Usuario, { foreignKey: 'creado_por', as: 'creador' });

Usuario.hasMany(Stream, { foreignKey: 'usuario_id', as: 'streams' });
Stream.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Categoria.hasMany(Stream, { foreignKey: 'categoria_id', as: 'streams' });
Stream.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

Stream.hasMany(MensajeChat, { foreignKey: 'stream_id', as: 'mensajes' });
MensajeChat.belongsTo(Stream, { foreignKey: 'stream_id', as: 'stream' });

Usuario.hasMany(MensajeChat, { foreignKey: 'usuario_id', as: 'mensajes' });
MensajeChat.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(MovimientoMoneda, { foreignKey: 'usuario_id', as: 'movimientos' });
MovimientoMoneda.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Stream.hasMany(MovimientoMoneda, { foreignKey: 'stream_id', as: 'movimientos' });
MovimientoMoneda.belongsTo(Stream, { foreignKey: 'stream_id', as: 'stream' });

Regalo.hasMany(MovimientoMoneda, { foreignKey: 'regalo_id', as: 'movimientos' });
MovimientoMoneda.belongsTo(Regalo, { foreignKey: 'regalo_id', as: 'regalo' });

module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Regalo,
  Stream,
  MensajeChat,
  MovimientoMoneda
};
