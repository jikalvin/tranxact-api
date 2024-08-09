const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: { type: String, required: true },
  documentNumber: { type: String, required: true },
  level: { type: String, enum: ['Level 1', 'Level 2'], required: true, default: 'Level 1' },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now }
});

const KYC = mongoose.model('KYC', kycSchema);

module.exports = KYC;
