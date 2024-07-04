const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const crypto = require('crypto');

// Register
exports.register = async (req, res) => {
    const { email, phone, password } = req.body;
    console.log(email, phone, password);

    if (!email && !phone) {
        return res.status(400).json({ msg: 'Either email or phone is required' });
    }
    if (!password) {
        return res.status(400).json({ msg: 'Password is required' });
    }

    try {
        // Build the query object
        let query = { email };
        if (phone) {
            query = {
                $or: [{ email }, { phone }]
            };
        } else {
            query = { email };
        }

        // Check if user already exists
        const existingUser = await User.findOne(query);
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            email: email || null,
            phone: phone || null,
            password: hashedPassword,
            emailVerificationToken: email ? Math.floor(100000 + Math.random() * 900000).toString() : undefined,
            phoneVerificationToken: phone ? Math.floor(100000 + Math.random() * 900000).toString() : undefined,
        });

        // Save the user to the database
        await newUser.save();

        // Send verification email or SMS
        if (email) {
            await sendEmail(email, 'Verify your email', `Your verification code is: ${newUser.emailVerificationToken}`);
        } else if (phone) {
            await sendSMS(phone, `Your verification code is: ${newUser.phoneVerificationToken}`);
        }

        res.status(201).json({ msg: 'User registered successfully. Please verify your email or phone.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    const { email, token } = req.body;
    console.log(email, token)

    try {
        const user = await User.findOne({ email });

        if (!user || user.emailVerificationToken !== token) {
            return res.status(400).json({ msg: 'Invalid token or user not found' });
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;

        await user.save();

        res.status(200).json({ msg: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Verify Phone
exports.verifyPhone = async (req, res) => {
    const { phone, token } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (!user || user.phoneVerificationToken !== token) {
            return res.status(400).json({ msg: 'Invalid token or user not found' });
        }

        user.phoneVerified = true;
        user.phoneVerificationToken = undefined; // Clear the token after verification

        await user.save();

        res.status(200).json({ msg: 'Phone verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        // Build the query object
        let query = { email };
        if (phone) {
            query = {
                $or: [{ email }, { phone }]
            };
        } else {
            query = { email };
        }

        // Find the user by email or phone
        const user = await User.findOne(query);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log(user.password, password)
        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if the email or phone is verified
        if (email && !user.emailVerified) {
            return res.status(400).json({ msg: 'Please verify your email first' });
        }
        if (phone && !user.phoneVerified) {
            return res.status(400).json({ msg: 'Please verify your phone first' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};
