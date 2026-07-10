const express = require('express');
const {
  checkUsername,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  purchaseCoins
} = require('../controllers/userController');

const router = express.Router();

router.get('/check-username/:username', checkUsername);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.post('/:id/purchase-coins', purchaseCoins);

module.exports = router;
