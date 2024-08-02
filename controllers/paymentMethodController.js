const PaymentMethod = require('../models/paymentMethodModel');

exports.createPaymentMethod = async (req, res) => {
  try {
    const newPaymentMethod = await PaymentMethod.create(req.body);
    res.status(201).json(newPaymentMethod);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePaymentMethod = async (req, res) => {
  try {
    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPaymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    res.json(updatedPaymentMethod);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPaymentMethods = async (req, res) => {
    try {
      const paymentMethods = await PaymentMethod.find();
      res.json(paymentMethods);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  