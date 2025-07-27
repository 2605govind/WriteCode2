import mongoose, { Schema } from 'mongoose'

// userName
// fullName
// profileImage
// email
// password
// role
// isVerified
// optForEmailVarification

const userschema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed']
    },

    fullName: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [2, "fullName must be at least 2 characters"],
        maxLength: [50, "fullName must be under 50 characters"]
    },

    profileImage: {
        type: String,
        default: "https://imgs.search.brave.com/3s7I5gUIjPQBWHos_dE2HnqNca6c1Kn3ay-YAbh2dY4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2NkLzRi/L2Q5L2NkNGJkOWIw/ZWEyODA3NjExYmEz/YTY3YzMzMWJmZjBi/LmpwZw"
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        // unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
        type: String,
        select: false,
    },

    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem',
            // unique:true
        }],
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },

}, { timestamps: true })


const User = mongoose.model('user', userschema);

export default User;