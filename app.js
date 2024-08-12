const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('./socket');
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
const annualStatisticRoutes = require('./routes/annualStatistics');
const limitController = require('./controllers/limitController');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const bannerRoutes = require('./routes/bannerRoutes');

// Connect Database
connectDB();

const app = express();

const server = http.createServer(app);
const io = socketIO.init(server);
let ioInstance;

// Init Middleware
app.use(express.json());

// Set up CORS middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/cryptos', authMiddleware, cryptoRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/kyc', authMiddleware, kycRoutes);
app.use('/api/limits', authMiddleware, limitRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/annual-statistics', authMiddleware, annualStatisticRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/banner', bannerRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
ioInstance = io;

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = { app, server };