const express = require('express');
const { getAllPayments, createPaymentMethod } = require('../controllers/paymentController');
const router = express.Router();

router.route('/')
  .get(getAllPayments)
  .post(createPaymentMethod);

// Implement other routes as needed

module.exports = router;
