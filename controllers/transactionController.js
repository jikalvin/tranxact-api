const Transaction = require('../models/Transaction');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId').populate('cryptoId');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  const { userId, cryptoId, type, amount, status } = req.body;
  try {
    const newTransaction = new Transaction({ userId, cryptoId, type, amount, status });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Implement other CRUD operations as needed
