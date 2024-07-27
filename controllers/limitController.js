const Limit = require('../models/limitModel');

exports.getAllLimits = async (req, res) => {
  try {
    const limits = await Limit.find();
    res.status(200).json(limits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLimit = async (req, res) => {
  const { userType, action, limit, status } = req.body;
  try {
    const newLimit = new Limit({ userType, action, limit, status });
    await newLimit.save();
    res.status(201).json(newLimit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Implement other CRUD operations as needed
