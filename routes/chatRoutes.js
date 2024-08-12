const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/', chatController.getRecentChats);
router.post('/message', chatController.sendMessage);

module.exports = router;
