import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import JWT from "jsonwebtoken";
import crypto from "crypto";

config();
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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods = {
    generateJWTtoken: async function () {

        const payload = {
            id: this._id,
            email: this.email,
            subscription: this.subscription,
            role: this.role
        }

        const secretKey = process.env.JWT_SECRET;

        const options = { expiresIn: process.env.JWT_EXPIRY }

        return await JWT.sign(payload, secretKey, options);

    },
    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, tis.password);
    },
    generatePasswordResetToken: async function () {
        const resetToken = crypto.randomBytes(20).toString("hex");
        this.forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .disgest('hex');

        this.forgotPasswordExpiry = Date.now() + a5 * 60 * 60 * 1000;

        return resetToken;
    }
}


const User = mongoose.model('User', userSchema);

export default User;
