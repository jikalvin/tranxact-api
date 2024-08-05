const Crypto = require('../models/cryptoModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Define the upload directory path
const uploadDir = path.join(__dirname, '..', 'uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.status(200).json(cryptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCrypto = [
  upload.single('image'),
  async (req, res) => {
    const { name, network, buyRate, sellRate, status, walletAddress, transferFee } = req.body;
    
    try {
      const newCrypto = new Crypto({
        name,
        network,
        buyRate,
        sellRate,
        status,
        walletAddress,
        transferFee,
        image: req.file ? req.file.path : undefined // Store the file path
      });
      
      await newCrypto.save();
      res.status(201).json(newCrypto);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error.message);
    }
  }
];

exports.updateCrypto = [
  upload.single('image'),
  async (req, res) => {
    const { id } = req.params;
    const { name, network, buyRate, sellRate, status, qrCode, walletAddress, transferFee } = req.body;

    // Check if id is provided and valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid crypto ID' });
    }

    try {
      let updateData = {
        name,
        network,
        buyRate,
        sellRate,
        status,
        qrCode,
        walletAddress,
        transferFee
      };

      // Only update the image if a new file was uploaded
      if (req.file) {
        updateData.image = req.file.path;
      }

      const updatedCrypto = await Crypto.findByIdAndUpdate(
        id, 
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedCrypto) {
        return res.status(404).json({ message: 'Crypto not found' });
      }

      res.status(200).json(updatedCrypto);
    } catch (error) {
      console.error('Error updating crypto:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
];