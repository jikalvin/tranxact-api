const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['buy', 'sell'] },
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    totalCost: { type: Number },
    totalRevenue: { type: Number },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
