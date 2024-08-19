const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupportRequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Pending', 'Closed'], default: 'Open' },
  responses: [
    {
      response: { type: String },
      responder: { type: Schema.Types.ObjectId, ref: 'Admin' },
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SupportRequest', SupportRequestSchema);