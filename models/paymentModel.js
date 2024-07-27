const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled' }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
