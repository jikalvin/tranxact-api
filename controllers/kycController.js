const KYC = require('../models/kycModel');
const { uploadDocument } = require('../utils/documentUploader'); // Assuming you have this utility function

exports.getAllKycRecords = async (req, res) => {
  try {
    const kycRecords = await KYC.find().populate('userId');
    res.status(200).json(kycRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createKycRecord = async (req, res) => {
  const { userId, documentType, documentNumber, level, status } = req.body;
  const { document } = req.files; // Assuming you're using a file upload middleware

  try {
    const uploadedDocument = await uploadDocument(document);
    const newKycRecord = new KYC({
      userId,
      documentType,
      documentNumber,
      level,
      status,
      document: uploadedDocument.url
    });
    await newKycRecord.save();
    res.status(201).json(newKycRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};