import Book from "../model/book.model.js"

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

export {
    newReleases,
    dailyTop100,
    bookData
}


// Ashok Sahoo 