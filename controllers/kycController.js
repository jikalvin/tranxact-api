const KYC = require('../models/kycModel');

exports.getAllKycRecords = async (req, res) => {
  try {
    const kycRecords = await KYC.find().populate('userId');
    res.status(200).json(kycRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createKycRecord = async (req, res) => {
  const { userId, documentType, documentNumber, status } = req.body;
  try {
    const newKycRecord = new KYC({ userId, documentType, documentNumber, status });
    await newKycRecord.save();
    res.status(201).json(newKycRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Implement other CRUD operations as needed
