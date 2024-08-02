const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Route to get all users
router.get('/', UserController.getAllUsers);
router.get('/current', UserController.getCurrentUser);

module.exports = router;
