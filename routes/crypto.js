const express = require('express');
const { getAllCryptos, createCrypto, updateCrypto } = require('../controllers/cryptoController');
const router = express.Router();

router.route('/')
  .get(getAllCryptos)
  .post(createCrypto);

router.route('/:id')
  .put(updateCrypto);

module.exports = router;