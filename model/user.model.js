import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    'User-ID': {
        type: Number,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

export default User;
