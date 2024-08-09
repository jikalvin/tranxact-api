const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const admin = require('../firebase'); // Import Firebase Admin SDK

// User registration
exports.register = async (req, res) => {
    const { email, phone, password, fullName } = req.body;

    if (!email && !phone) {
        return res.status(400).json({ msg: 'Either email or phone is required' });
    }
    if (!password) {
        return res.status(400).json({ msg: 'Password is required' });
    }

    try {
        let query = { email };
        if (phone) {
            query = { $or: [{ email }, { phone }] };
        } else {
            query = { email };
        }

        const existingUser = await User.findOne(query);
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email || null,
            phone: phone || null,
            fullName,
            role: 'user',
            password: hashedPassword,
            emailVerificationToken: email ? Math.floor(100000 + Math.random() * 900000).toString() : undefined,
            phoneVerificationToken: phone ? Math.floor(100000 + Math.random() * 900000).toString() : undefined,
        });

        await newUser.save();

        // Send verification email if email is provided
        if (email) {
            await sendEmail(email, 'Verify your email', `Your verification code is: ${newUser.emailVerificationToken}`);
        } else if (phone) {
            // await sendSMS(phone, `Your verification code is: ${newUser.phoneVerificationToken}`);
        }

        // Create JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            msg: 'User registered successfully. Please verify your email or phone.',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                phone: newUser.phone,
                fullName: newUser.fullName,
                role: newUser.role,
                emailVerified: newUser.emailVerified,
                phoneVerified: newUser.phoneVerified,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Admin registration
exports.adminRegister = async (req, res) => {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
        return res.status(400).json({ msg: 'Either email or phone is required' });
    }
    if (!password) {
        return res.status(400).json({ msg: 'Password is required' });
    }

    try {
        let query = { email };
        if (phone) {
            query = { $or: [{ email }, { phone }] };
        } else {
            query = { email };
        }

        const existingUser = await User.findOne(query);
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email || null,
            phone: phone || null,
            password: hashedPassword,
            emailVerified: true,
            phoneVerified: true,
            role: 'admin'
        });

        await newUser.save();

        // Create a new user in Firebase
        const firebaseUser = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: email || phone
        });

        res.status(201).json({ msg: 'Admin registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    const { email, token } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.emailVerificationToken !== token) {
            return res.status(400).json({ msg: 'Invalid token or user not found' });
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;

        await user.save();

        // Update Firebase user
        // await admin.auth().updateUser(user._id.toString(), {
        //     emailVerified: true
        // });

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
        user.phoneVerificationToken = undefined;

        await user.save();

        // Update Firebase user
        await admin.auth().updateUser(user._id.toString(), {
            phoneNumber: phone,
            phoneNumberVerified: true
        });

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
        let query = { email };
        if (phone) {
            query = { $or: [{ email }, { phone }] };
        }

        const user = await User.findOne(query);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (email && !user.emailVerified) {
            return res.status(400).json({ msg: 'Please verify your email first' });
        }
        if (phone && !user.phoneVerified) {
            return res.status(400).json({ msg: 'Please verify your phone first' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};
