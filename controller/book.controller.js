import Book from "../model/book.model.js"
import Rating from "../model/rating.model.js"
import UserDownvote from "../model/user.downvote.model.js";
import UserUpvote from "../model/user.upvote.model.js";

const newReleases = async (req, res) => {
    const PAGE_SIZE = 10;
    try {
        const page = parseInt(req.query.page) || 1; // Get the requested page from the query parameter
        const skip = (page - 1) * PAGE_SIZE; // Calculate the number of documents to skip

        const newReleases = await Book.find({ 'Year-Of-Publication': 2000 })
            .skip(skip)
            .limit(PAGE_SIZE);
        // console.log(newReleases);
        res.status(200).json(newReleases);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

const dailyTop100 = async (req, res) => {
    const PAGE_SIZE = 10;
    try {
        const page = parseInt(req.query.page) || 1;// Get the requested page from the query parameter
        const skip = (page - 1) * PAGE_SIZE; // Calculate the number of documents to skip
        // Sort books by ratings in descending order and limit to the top 100
        const topBooks = await Book.aggregate([
            {
                $lookup: {
                    from: 'ratings', // Assuming your ratings collection is named 'ratings'
                    localField: 'ISBN',
                    foreignField: 'ISBN',
                    as: 'ratings',
                },
            },
            {
                $unwind: '$ratings',
            },
            {
                $group: {
                    _id: '$_id',
                    'Book-Title': { $first: '$Book-Title' },
                    'Image-URL-M': { $first: '$Image-URL-M' },
                    averageRating: { $avg: '$ratings.Book-Rating' },
                },
            },
            {
                $sort: { averageRating: -1 },
            },
            {
                $skip: skip, // Skip a certain number of documents
            },
            {
                $limit: PAGE_SIZE,
            },
        ]);

        res.json(topBooks);
    } catch (error) {
        res.status(500).json({ error: `${error.message}` });
    }
}

const bookData = async (req, res) => {
    try {
        const id = req.params['bookid'];
        const bookDetails = await Book.findById(id)
        res.status(200).json(bookDetails);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

const bestSellers = async (req, res) => {
    const PAGE_SIZE = 10;
    try {
        const page = parseInt(req.query.page) || 1;

        const booksPerPage = PAGE_SIZE;
        const skip = (page - 1) * booksPerPage;

        // Fetch a subset of books
        const booksSubset = await Book.find({})
            .skip(skip)
            .limit(booksPerPage);

        // Calculate the average rating for each book in the subset
        const booksWithRatings = await Promise.all(booksSubset.map(async (book) => {
            try {
                const ratings = await Rating.find({ ISBN: book.ISBN });
                let sum = 0;
                let count = 0;
                ratings.forEach((rating) => {
                    const ratingValue = rating.bookRating;
                    if (typeof rating.bookRating === "number") {
                        const ratingValue = (rating.bookRating);
                        if (ratingValue !== 0) {
                            sum += ratingValue;
                            count++;
                        }
                    } else {
                        console.log('The Book-Rating field is not a number.');
                    }
                });


                let averageRating = count > 0 ? sum / count : 0;
                averageRating = averageRating.toFixed(1);
                return {
                    book,
                    averageRating,
                };
            } catch (error) {
                // Handle any errors that may occur when querying ratings for a book
                console.error(`Error calculating ratings for book with ISBN: ${book.ISBN}`);
                console.error(error);
                return {
                    book,
                    averageRating: 0, // Handle the error by setting the averageRating to 0
                };
            }
        }));

        // Sort the books by average rating in descending order
        const sortedBooks = booksWithRatings.sort((a, b) => b.averageRating - a.averageRating);

        res.json(sortedBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Endpoint for Upvote a Book
const upvote = async (req, res) => {
    const bookId = req.params.bookid;
    // const userId = req.user.userId; // Get the user ID from the cookies through middleware
    const userId = '653aadef537da3630b41141d';

    try {
        // Check if the user has already upvoted this book
        const existingUpvote = await UserUpvote.findOne({ userId, bookId });
        console.log(existingUpvote);
        if (existingUpvote) {
            // User has previously upvoted; remove the upvote
            await UserUpvote.deleteOne({ _id: existingUpvote._id }); // Remove the document by its _id

            // Decrement the upvotes in the book
            const book = await Book.findById(bookId);
            book.upvotes -= 1;
            await book.save();

            res.json({ message: 'Upvote removed', upvotes: book.upvotes, book: book });
        } else {
            // User has not upvoted before; upvote the book
            const newUpvote = await UserUpvote.create({ userId, bookId });

            // Increment the upvotes in the book
            const book = await Book.findById(bookId);
            book.upvotes += 1;
            await book.save();

            res.json({ message: 'Upvoted successfully', upvotes: book.upvotes, book: book });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Endpoint for Downvote a Book
const downvote = async (req, res) => {
    const bookId = req.params.bookid;
    // const userId = req.body.userId; // Assuming you have a user ID in the request body
    const userId = "653aadef537da3630b41141d";

    try {
        // Check if the user has already downvoted this book
        const existingDownvote = await UserDownvote.findOne({ userId, bookId });
        console.log(existingDownvote);
        if (existingDownvote) {
            // User has previously downvoted; remove the downvote
            await UserDownvote.deleteOne({ _id: existingDownvote._id }); // Remove the document by its _id

            // Decrement the downvotes in the book
            const book = await Book.findById(bookId);
            book.downvotes -= 1;
            await book.save();

            res.json({ message: 'Downvote removed', downvotes: book.downvotes, book: book });
        } else {
            // User has not downvoted before; downvote the book
            const newDownvote = await UserDownvote.create({ userId, bookId });

            // Increment the downvotes in the book
            const book = await Book.findById(bookId);
            book.downvotes += 1;
            await book.save();

            res.json({ message: 'Downvoted successfully', downvotes: book.downvotes, book: book });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export {
    newReleases,
    dailyTop100,
    bookData,
    bestSellers,
    upvote,
    downvote
}


// Ashok Sahoo 