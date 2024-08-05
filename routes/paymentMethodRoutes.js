const express = require('express');
const router = express.Router();
const PaymentMethodController = require('../controllers/paymentMethodController');

router.post('/', PaymentMethodController.createPaymentMethod);
router.put('/:id', PaymentMethodController.updatePaymentMethod);
router.get('/', PaymentMethodController.getPaymentMethods);

module.exports = router;
