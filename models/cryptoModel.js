const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  network: { type: String, required: true },
  buyRate: { type: Number, required: true },
  sellRate: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;
