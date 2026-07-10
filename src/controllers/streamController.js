const { Stream, Usuario, MensajeChat, MovimientoMoneda, Regalo } = require('../models');
const { computeViewerLevel } = require('../utils/levels');
const { mapUser } = require('./userController');

function parseStreamReference(streamId) {
  const streamReference = String(streamId || '').trim();
  const numericStreamId = /^\d+$/.test(streamReference) ? Number(streamReference) : null;
  return { streamReference, numericStreamId };
}

async function createStream(req, res) {
  try {
    const { usuario_id, categoria_id, titulo, descripcion, estado } = req.body;

    if (!usuario_id || !titulo) {
      return res.status(400).json({ message: 'Usuario y titulo son obligatorios' });
    }

    const usuario = await Usuario.findByPk(usuario_id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const stream = await Stream.create({
      usuario_id,
      categoria_id: categoria_id || null,
      titulo: String(titulo).trim(),
      descripcion: descripcion || '',
      estado: estado || 'en_vivo'
    });

    return res.status(201).json({ id: stream.id });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo crear el stream' });
  }
}

async function streamHeartbeat(req, res) {
  try {
    const stream = await Stream.findByPk(req.params.id);

    if (!stream) {
      return res.status(404).json({ message: 'Stream no encontrado' });
    }

    const seconds = Number(req.body.seconds || 0);
    const viewerId = req.body.viewerId || null;
    const previousSeconds = Number(stream.segundos_acumulados || 0);

    stream.segundos_acumulados = previousSeconds + seconds;
    await stream.save();

    const usuario = await Usuario.findByPk(stream.usuario_id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (viewerId && viewerId === stream.usuario_id) {
      const previousHours = Number(usuario.horas_streamer || 0);
      const previousPoints = Number(usuario.puntos || 0);
      const pointsGained = Math.max(0, Math.floor(stream.segundos_acumulados / 60) - Math.floor(previousSeconds / 60));

      usuario.horas_streamer = previousHours + seconds / 3600;
      usuario.puntos = previousPoints + pointsGained;
      usuario.nivel_actual = computeViewerLevel(usuario.puntos);
      await usuario.save();
    }

    return res.json({
      usuario: {
        horas_streamer: Number(usuario.horas_streamer || 0),
        puntos: Number(usuario.puntos || 0),
        nivel_actual: usuario.nivel_actual
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo actualizar el stream' });
  }
}

async function endStream(req, res) {
  try {
    const stream = await Stream.findByPk(req.params.id);

    if (!stream) {
      return res.status(404).json({ message: 'Stream no encontrado' });
    }

    stream.estado = 'finalizado';
    stream.fecha_fin = new Date();
    await stream.save();

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo finalizar el stream' });
  }
}

async function addChatMessage(req, res) {
  try {
    const { stream_id, usuario_id, alias, nivel, texto } = req.body;

    if (!stream_id || !texto) {
      return res.status(400).json({ message: 'Stream y texto son obligatorios' });
    }

    const { streamReference, numericStreamId } = parseStreamReference(stream_id);

    await MensajeChat.create({
      stream_id: numericStreamId,
      stream_referencia: streamReference,
      usuario_id: usuario_id || null,
      alias: alias || null,
      nivel: nivel || null,
      texto: String(texto).trim()
    });

    if (!usuario_id) {
      return res.json({ usuario: { puntos: 0, nivel_actual: 'Bronce' } });
    }

    const usuario = await Usuario.findByPk(usuario_id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.puntos = Number(usuario.puntos || 0) + 1;
    usuario.nivel_actual = computeViewerLevel(usuario.puntos);
    await usuario.save();

    return res.json({ usuario: mapUser(usuario) });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo guardar el mensaje' });
  }
}

async function sendDonation(req, res) {
  try {
    const { usuario_id, stream_id, regalo_id, monedas_gastadas, puntos_ganados, mensaje } = req.body;

    if (!usuario_id || !stream_id || !monedas_gastadas) {
      return res.status(400).json({ message: 'Datos incompletos para la donacion' });
    }

    const usuario = await Usuario.findByPk(usuario_id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const spentCoins = Number(monedas_gastadas || 0);
    const rewardPoints = Number(puntos_ganados || 0);

    if (Number(usuario.monedas || 0) < spentCoins) {
      return res.status(400).json({ message: 'Monedas insuficientes' });
    }

    const { streamReference, numericStreamId } = parseStreamReference(stream_id);

    if (numericStreamId) {
      const stream = await Stream.findByPk(numericStreamId);
      if (!stream) {
        return res.status(404).json({ message: 'Stream no encontrado' });
      }
    }

    if (regalo_id) {
      const regalo = await Regalo.findByPk(regalo_id);
      if (!regalo) {
        return res.status(404).json({ message: 'Regalo no encontrado' });
      }
    }

    usuario.monedas = Number(usuario.monedas || 0) - spentCoins;
    usuario.puntos = Number(usuario.puntos || 0) + rewardPoints;
    usuario.nivel_actual = computeViewerLevel(usuario.puntos);
    await usuario.save();

    await MovimientoMoneda.create({
      usuario_id,
      stream_id: numericStreamId,
      stream_referencia: streamReference,
      regalo_id: regalo_id || null,
      tipo: 'donacion',
      monedas: spentCoins,
      puntos: rewardPoints,
      mensaje: mensaje || null
    });

    return res.json({ usuario: mapUser(usuario) });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo procesar la donacion' });
  }
}

module.exports = {
  createStream,
  streamHeartbeat,
  endStream,
  addChatMessage,
  sendDonation
};
