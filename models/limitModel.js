const mongoose = require('mongoose');

const limitSchema = new mongoose.Schema({
  userType: { type: String, enum: ['Verified', 'Unverified'], required: true },
  action: { type: String, required: true },
  limit: { type: String, required: true },
  status: { type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled' }
});

const Limit = mongoose.model('Limit', limitSchema);

module.exports = Limit;
