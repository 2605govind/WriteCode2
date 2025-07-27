import mongoose from 'mongoose'

const notvarifieduser = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [2, "fullName must be at least 2 characters"],
        maxLength: [50, "fullName must be under 50 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        immutable: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
        type: String,
        require: true,
        minLength: [5, "Password must be at least 5 characters"],
        select: false,
    },

    otp: {
        type: String,
    },

    optExpires: {
        type: Date
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: String,
        default: Date.now,
    }
});


const Notvarifyuser = mongoose.model('notvarifieduser', notvarifieduser);

export default Notvarifyuser;