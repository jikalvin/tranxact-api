const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getUserTransaction
} = require('../controllers/transactionController');

router.get('/', authMiddleware, getAllTransactions);
router.get('/user', authMiddleware, getUserTransaction);
router.post('/', authMiddleware, createTransaction);
router.put('/:id', authMiddleware, updateTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);

module.exports = router;
