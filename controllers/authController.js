const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const crypto = require('crypto');

exports.register = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            phone,
            password: await bcrypt.hash(password, 10),
            emailVerificationToken: crypto.randomBytes(2).toString('hex'),
            phoneVerificationToken: crypto.randomBytes(6).toString('hex')
        });

        await user.save();

        sendEmail(user.email, 'Email Verification', `Your verification code is ${user.emailVerificationToken}`);
        sendSMS(user.phone, `Your verification code is ${user.phoneVerificationToken}`);

        res.send('Registration successful. Please check your email and phone for verification codes.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, token } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (user.emailVerificationToken !== token) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;

        await user.save();

        res.send('Email verified successfully.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyPhone = async (req, res) => {
    const { phone, token } = req.body;

    try {
        let user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (user.phoneVerificationToken !== token) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        user.phoneVerified = true;
        user.phoneVerificationToken = undefined;

        await user.save();

        res.send('Phone verified successfully.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        let user = email ? await User.findOne({ email }) : await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (email && !user.emailVerified) {
            return res.status(400).json({ msg: 'Email not verified' });
        }

        if (phone && !user.phoneVerified) {
            return res.status(400).json({ msg: 'Phone not verified' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
