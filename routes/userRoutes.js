const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to get all users
router.get('/', authMiddleware, UserController.getAllUsers);
router.get('/current', UserController.getCurrentUser);

const userManagementController = require('../controllers/userManagementController');
router.post('/', authMiddleware, userManagementController.createUser);
router.put('/:userId', authMiddleware, userManagementController.updateUser);
router.delete('/:userId', authMiddleware, userManagementController.deleteUser);
router.get('/:userId', authMiddleware, userManagementController.getUserById);
router.put('/:userId/role', authMiddleware, userManagementController.updateUserRole);
router.put('/:userId/activate', authMiddleware, userManagementController.activateUser);
module.exports = router;
