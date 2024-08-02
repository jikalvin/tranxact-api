const express = require('express');
const router = express.Router();
const PaymentMethodController = require('../controllers/paymentMethodController');

router.post('/', PaymentMethodController.createPaymentMethod);
router.put('/:id', PaymentMethodController.updatePaymentMethod);

module.exports = router;
