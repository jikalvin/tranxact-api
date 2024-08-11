const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    fullName: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    // Other fields remain unchanged
    phoneVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['verified', 'unverified', 'pending'],
        default: 'unverified'
    },
    emailVerificationToken: {
        type: String
    },
    phoneVerificationToken: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    pin: {
        type: String,
        select: false
    },
    role: {
        type: String,
        default: "user",
    },
    residence: {
        type: String,
    },
});

module.exports = mongoose.model('User', UserSchema);

UserSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (err) {
        next(err);
    }
});
