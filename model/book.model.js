import mongoose from "mongoose";

// Define a schema for the book data
const bookSchema = new mongoose.Schema({
    ISBN: String,
    'Book-Title': String,
    'Book-Author': String,
    'yearOfPublication': Number,
    Publisher: String,
    'Image-URL-S': String,
    'Image-URL-M': String,
    'Image-URL-L': String,
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
});

// Create the Mongoose model using the schema
const Book = mongoose.model('Book', bookSchema);

export default Book;
