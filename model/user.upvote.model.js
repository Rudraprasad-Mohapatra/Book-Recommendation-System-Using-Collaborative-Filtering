import mongoose from "mongoose";
import User from "./user.model.js";
import Book from "./book.model.js";

const userUpvoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
});

const UserUpvote = mongoose.model('UserUpvote', userUpvoteSchema);

export default UserUpvote;
