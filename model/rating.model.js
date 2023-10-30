import mongoose from "mongoose";

// Define a schema for the rating data
const ratingSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    ISBN: {
        type: String,
        required: true
    },
    bookRating: {
        type: Number,
        required: true
    }
});

// Create the Mongoose model using the schema
const Rating = mongoose.model('Rating', ratingSchema);

export default Rating ;
