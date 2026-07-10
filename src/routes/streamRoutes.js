const express = require('express');
const {
  createStream,
  streamHeartbeat,
  endStream,
  addChatMessage,
  sendDonation
} = require('../controllers/streamController');

const router = express.Router();

router.post('/', createStream);
router.post('/:id/heartbeat', streamHeartbeat);
router.post('/:id/end', endStream);
router.post('/chat/messages', addChatMessage);
router.post('/donations', sendDonation);

module.exports = router;
