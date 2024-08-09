const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalActiveUsers = await User.countDocuments({
            $or: [
                { emailVerified: true },
                { phoneVerified: true }
            ]
        });
        const joinedToday = await User.countDocuments({
            createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
        });
        const totalVerifiedUsers = await User.countDocuments({
            status: 'verified'
        });

        const annualStatisticData = [
            { title: 'Total Users', value: totalUsers.toString() },
            { title: 'Total Active Users', value: totalActiveUsers.toString() },
            { title: 'Joined Today', value: joinedToday.toString() },
            { title: 'Total Verified Users', value: totalVerifiedUsers.toString() },
        ];

        res.json(annualStatisticData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching annual statistics' });
    }
});

router.get('/transaction-stats', async (req, res) => {
    try {
        const pendingRequests = await Transaction.countDocuments({ status: 'pending' });
        const completedRequests = await Transaction.countDocuments({ status: 'completed' });
        const rejectedRequests = await Transaction.countDocuments({ status: 'failed' });
        const totalExchanges = await Transaction.countDocuments();

        const transactionStats = {
            pending: pendingRequests,
            completed: completedRequests,
            rejected: rejectedRequests,
            total: totalExchanges
        };

        res.json(transactionStats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction statistics' });
    }
});

module.exports = router;
