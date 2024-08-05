const express = require('express');
const { getAllMessages, createMessage } = require('../controllers/messageController');
const router = express.Router();

router.route('/')
  .get(getAllMessages)
  .post(createMessage);

// Implement other routes as needed

module.exports = router;
