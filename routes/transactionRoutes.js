// routes/transactions.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Transaction = require('../models/Transaction');
const Crypto = require('../models/cryptoModel');

// Create a new transaction
router.post('/', authMiddleware, async (req, res) => {
    const { cryptoName, amount, type } = req.body;

    try {
        // Find the crypto by name
        const crypto = await Crypto.findOne({ name: cryptoName });
        if (!crypto) {
            return res.status(404).json({ message: 'Crypto not found' });
        }

        const newTransaction = new Transaction({
            userId: req.user.id, // Get userId from authenticated user
            cryptoId: crypto._id,
            amount,
            type
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
