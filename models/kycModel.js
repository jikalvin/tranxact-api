const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  step: { type: Number, required: true, enum: [1, 2, 3, 4] },
  name: { type: String },
  dob: { type: String },
  phone: { type: String },
  email: { type: String },
  occupation: { type: String },
  idNumber: { type: String },
  idFront: { type: String },
  idBack: { type: String },
  address: { type: String },
  proofOfAddress: { type: String },
  selfie: { type: String },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

const KYC = mongoose.model('KYC', kycSchema);
module.exports = KYC;