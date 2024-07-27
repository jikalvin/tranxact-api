const Crypto = require('../models/cryptoModel');

exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.status(200).json(cryptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCrypto = async (req, res) => {
  const { name, network, buyRate, sellRate, status } = req.body;
  try {
    const newCrypto = new Crypto({ name, network, buyRate, sellRate, status });
    await newCrypto.save();
    res.status(201).json(newCrypto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Implement other CRUD operations as needed
