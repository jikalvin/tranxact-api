const Transaction = require('../models/Transaction');
const Crypto = require('../models/cryptoModel');
const socketIO = require('../socket');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  const { userName, name, amount, network, buyRate, sellRate, type, status, phoneNumber, walletAddress } = req.body;
  try {
    const crypto = await Crypto.findOne({ name });
    if (!crypto) {
      return res.status(404).json({ message: 'Crypto not found' });
    }

    const newTransaction = new Transaction({
      userId: req.user.id,
      userName,
      cryptoId: crypto._id,
      name,
      amount,
      network,
      buyRate,
      sellRate,
      type,
      status,
      walletAddress,
      phoneNumber
    });

    const savedTransaction = await newTransaction.save();
    console.log("Transaction saved")

    try {
      const io = socketIO.getIo();
      io.emit('newTransaction', newTransaction);
      console.log("Transaction emitted");
    } catch (error) {
      console.error("Error emitting socket event:", error.message);
    }

    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });

    try {
      const io = socketIO.getIo();
      io.emit('updatedTransaction', updatedTransaction);
      console.log("Transaction emitted");
    } catch (error) {
      console.error("Error emitting socket event:", error.message);
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
