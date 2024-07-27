const Payment = require('../models/paymentModel');

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

exports.createPaymentMethod = async (req, res) => {
    const { userId, method, details, status } = req.body;
    try {
      const newPaymentMethod = new Payment({ userId, method, details, status });
      await newPaymentMethod.save();
      res.status(201).json(newPaymentMethod);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Implement other CRUD operations as needed
  