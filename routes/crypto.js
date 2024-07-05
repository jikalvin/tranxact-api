const express = require('express');
const router = express.Router();
const { buyCrypto, sellCrypto } = require('../controllers/cryptoController');
const auth = require('../middlewares/authMiddleware');

router.post('/buy', auth, buyCrypto);
router.post('/sell', auth, sellCrypto);

module.exports = router;
