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
  const { userId, step, ...stepData } = req.body;
  
  try {
    let kycRecord = await KYC.findOne({ userId });

    if (!userId || !step) {
      return res.status(400).json({ message: "UserId and step are required" });
    }

    if (!kycRecord) {
      kycRecord = new KYC({ userId, step });
    }

    // Update the fields for the current step
    Object.keys(stepData).forEach(key => {
      kycRecord[key] = stepData[key];
    });

    // Handle file uploads
    if (req.files) {
      for (const [key, file] of Object.entries(req.files)) {
        const uploadedFile = await uploadDocument(file);
        kycRecord[key] = uploadedFile.url;
      }
    }

    kycRecord.step = step;
    
    if (step === 4) {
      kycRecord.completedAt = new Date();
    }

    await kycRecord.save();
    res.status(200).json(kycRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};