const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

router.get('/', authMiddleware, getAllTransactions);
router.post('/', authMiddleware, createTransaction);
router.put('/:id', authMiddleware, updateTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);

module.exports = router;
