const Chat = require('../models/Chat');
const socketIO = require('../socket');

exports.getRecentChats = async (req, res) => {
  try {
    const recentChats = await Chat.find().sort({ timestamp: -1 }).limit(10);
    res.json(recentChats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const message = new Chat(req.body);
  try {
    const savedMessage = await message.save();
    socketIO.getIo().emit('newMessage', savedMessage);
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
