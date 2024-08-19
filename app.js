const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const chatRoutes = require('./routes/chatRoutes');
const socketIO = require('./socket');
// const chatRoutes = require('./routes/chatRoutes');
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
const supportRoutes = require('./routes/supportRoutes');
const path = require('path');

// Connect Database
connectDB();

const app = express();

// Set up CORS middleware
app.use(cors());

const server = http.createServer(app);
const io = socketIO.init(server);
let ioInstance;

// Init Middleware
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/cryptos', authMiddleware, cryptoRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/kyc', authMiddleware, kycRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/limits', authMiddleware, limitRoutes);
app.use('/api/messages', authMiddleware, messageRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/annual-statistics', authMiddleware, annualStatisticRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/support', supportRoutes);

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
