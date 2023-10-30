import Book from "../model/book.model.js"
import Rating from "../model/rating.model.js"

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
        const id = req.params['id'];
        const bookDetails = await Book.findById(id)
        res.status(200).json(bookDetails);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

// Example endpoint for Best Sellers
// const bestSellers = async (req, res) => {
//     const PAGE_SIZE = 10;
//     try {
//         const page = parseInt(req.query.page) || 1;

//         const booksPerPage = PAGE_SIZE;
//         const skip = (page - 1) * booksPerPage;

//         // Fetch a subset of books
//         const booksSubset = await Book.find({})
//             .skip(skip)
//             .limit(booksPerPage);

//         // Calculate the average rating for each book in the subset
//         const booksWithRatings = await Promise.all(booksSubset.map(async (book) => {
//             const ratings = await Rating.find({ ISBN: book.ISBN });
//             let sum = 0;
//             let count = 0;
//             ratings.forEach((rating) => {
//                 const ratingValue = rating['Book-Rating'];
//                 if (ratingValue !== 0) {
//                     sum += ratingValue;
//                     count++;
//                 }
//             });

//             const averageRating = count > 0 ? sum / count : 0;
//             console.log(sum);

//             return {
//                 book,
//                 averageRating,
//             };
//         }));

//         // Sort the books by average rating in descending order
//         const sortedBooks = booksWithRatings.sort((a, b) => b.averageRating - a.averageRating);

//         res.json(sortedBooks);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

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


                const averageRating = count > 0 ? sum / count : 0;
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



export {
    newReleases,
    dailyTop100,
    bookData,
    bestSellers
}


// Ashok Sahoo 