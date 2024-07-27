const Message = require('../models/messageModel');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('userId');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMessage = async (req, res) => {
  const { userId, subject, message } = req.body;
  try {
    const newMessage = new Message({ userId, subject, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Implement other CRUD operations as needed
