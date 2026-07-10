const express = require('express');
const {
  getGifts,
  createGift,
  updateGift,
  deleteGift
} = require('../controllers/giftController');

const router = express.Router();

router.get('/user/:userId', getGifts);
router.post('/', createGift);
router.put('/:id', updateGift);
router.delete('/:id', deleteGift);

module.exports = router;
