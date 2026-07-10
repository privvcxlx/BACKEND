const express = require('express');
const userRoutes = require('./userRoutes');
const giftRoutes = require('./giftRoutes');
const streamRoutes = require('./streamRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/gifts', giftRoutes);
router.use('/streams', streamRoutes);

module.exports = router;
