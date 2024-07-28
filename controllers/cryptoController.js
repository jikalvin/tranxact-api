const Crypto = require('../models/cryptoModel');
const multer = require('multer');
const path = require('path');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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

exports.createCrypto = async (req, res) => {
  const { name, network, buyRate, sellRate, status, walletAddress, transferFee, image } = req.body;
  console.log(req.body)

  try {
    const newCrypto = new Crypto({ 
      name, 
      network, 
      buyRate, 
      sellRate, 
      status, 
      walletAddress, 
      transferFee,
      image: image.file.uid // Store the image UID
    });
    await newCrypto.save();
    res.status(201).json(newCrypto);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

exports.updateCrypto = [
  upload.single('image'),
  async (req, res) => {
    const { id } = req.params;
    const { name, network, buyRate, sellRate, status, qrCode, walletAddress, transferFee } = req.body;
    const image = req.file ? req.file.path : undefined;

    try {
      const updatedCrypto = await Crypto.findByIdAndUpdate(
        id, 
        { name, network, buyRate, sellRate, status, qrCode, walletAddress, image, transferFee },
        { new: true }
      );
      if (!updatedCrypto) {
        return res.status(404).json({ message: 'Crypto not found' });
      }
      res.status(200).json(updatedCrypto);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];
