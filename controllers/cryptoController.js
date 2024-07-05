const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.buyCrypto = async (req, res) => {
    try {
        const { symbol, amount } = req.body;

        // Retrieve the user from req.user set by the middleware
        const user = req.user;

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check user's balance or perform other business logic here
        if (user.balance < amount) {
            return res.status(400).json({ msg: 'Insufficient balance' });
        }

        // Deduct the amount from the user's balance
        user.balance -= amount;

        // Save the updated user
        await user.save();

        // Perform the crypto purchase operation here

        res.status(200).json({ msg: 'Crypto purchase successful', transaction: { userId: user._id, symbol, amount, date: new Date() } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.sellCrypto = async (req, res) => {
    const { userId, amount, currency } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Add the amount to the user's balance
        user.balance += amount;
        await user.save();

        // Create a new transaction
        const transaction = new Transaction({
            userId: user._id,
            type: 'sell',
            amount,
            currency,
            status: 'completed',
            date: new Date()
        });

        await transaction.save();

        res.status(200).json({ msg: 'Crypto sold successfully', transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};
