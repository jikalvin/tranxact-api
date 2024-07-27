const express = require('express');
const { getAllLimits, createLimit } = require('../controllers/limitController');
const router = express.Router();

router.route('/')
  .get(getAllLimits)
  .post(createLimit);

// Implement other routes as needed

module.exports = router;
