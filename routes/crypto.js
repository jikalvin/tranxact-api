const express = require('express');
const { getAllCryptos, createCrypto } = require('../controllers/cryptoController');
const router = express.Router();

router.route('/')
  .get(getAllCryptos)
  .post(createCrypto);

// Implement other routes as needed

module.exports = router;
