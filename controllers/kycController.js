const KYC = require('../models/kycModel');
const { uploadDocument } = require('../utils/documentUploader');

exports.getAllKycRecords = async (req, res) => {
  try {
    const kycRecords = await KYC.find().populate('userId');
    res.status(200).json(kycRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitKycStep = async (req, res) => {
  try {
      const { userId, step, ...stepData } = req.body;

      if (!userId || !step) {
          return res.status(400).json({ message: "UserId and step are required" });
      }

      let kycRecord = await KYC.findOne({ userId });

      if (!kycRecord) {
          kycRecord = new KYC({ userId, step: parseInt(step) });
      } else {
          kycRecord.step = parseInt(step);
      }

      // Update the fields for the current step
      Object.keys(stepData).forEach(key => {
          if (stepData[key] !== undefined) {
              kycRecord[key] = stepData[key];
          }
      });

      // Handle file uploads
      if (req.files && req.files.length > 0) {
          req.files.forEach(file => {
              kycRecord[file.fieldname] = file.path; // or however you want to store the file reference
          });
      }

      if (parseInt(step) === 4) {
          kycRecord.completedAt = new Date();
      }

      await kycRecord.save();
      res.status(200).json(kycRecord);
  } catch (error) {
      console.error('KYC submission error:', error);
      res.status(500).json({ message: error.message });
  }
};