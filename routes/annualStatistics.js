const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

module.exports = router;
