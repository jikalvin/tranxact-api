const express = require('express');
const router = express.Router();
const SupportRequest = require('../models/supportModel');

// GET /api/support - Get all support requests
router.get('/', async (req, res) => {
  try {
    const supportRequests = await SupportRequest.find().populate('user').populate('responses.responder');
    res.json(supportRequests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
    const { message, userId } = req.body;
    console.log(req.body);
    // const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
  
    try {
      const newRequest = new SupportRequest({
        message,
        user: userId,
        status: 'Pending',
      });
  
      const savedRequest = await newRequest.save();
      res.status(201).json(savedRequest);
    } catch (error) {
      console.error('Error creating support request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// POST /api/support/:id/respond - Respond to a support request
router.post('/:id/respond', async (req, res) => {
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ message: 'Response is required' });
  }

  try {
    const supportRequest = await SupportRequest.findById(req.params.id);
    if (!supportRequest) {
      return res.status(404).json({ message: 'Support request not found' });
    }

    supportRequest.responses.push({
      response,
      responder: req.user.id, // Assume req.user is set by authMiddleware
    });

    if (supportRequest.status === 'Open') {
      supportRequest.status = 'Pending'; // Automatically change status when a response is given
    }

    await supportRequest.save();
    res.json({ message: 'Response sent successfully', supportRequest });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
