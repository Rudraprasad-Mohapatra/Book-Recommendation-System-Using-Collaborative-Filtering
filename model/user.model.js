import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: [true, "password is required"],
        select: false
    }, fullName: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be atleast 5 character'],
        maxLength: [50, 'Name should be less than 50 characters'],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        id: String,
        status: String,
    }
}, {
    timestamps: true
});



const User = mongoose.model('User', userSchema);

export default User;
