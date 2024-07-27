const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const admin = require('./firebase');
const authRoutes = require('./routes/auth');
const cryptoRoutes = require('./routes/crypto');
const transactionRoutes = require('./routes/transactionRoutes');
const kycRoutes = require('./routes/kycRoutes');
const limitRoutes = require('./routes/limitRoutes');
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

// Connect Database
connectDB();

const app = express();

// Init Middleware
app.use(express.json());

// Set up CORS middleware
app.use(cors());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/cryptos', authMiddleware, cryptoRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/kyc', authMiddleware, kycRoutes);
app.use('/api/limits', authMiddleware, limitRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/users', authMiddleware, userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
