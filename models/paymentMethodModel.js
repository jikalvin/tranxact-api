const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['mobile money', 'bank', 'paypal'], required: true },
  accountType: { type: String, enum: ['normal', 'float'], required: true },
  paymentShortcode: { type: String, required: true }
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
