import Book from "../model/book.model.js"

const newReleases = async (req, res) => {
    const PAGE_SIZE = 10;
    try {
        const page = parseInt(req.query.page) || 1; // Get the requested page from the query parameter
        const skip = (page - 1) * PAGE_SIZE; // Calculate the number of documents to skip

        const newReleases = await Book.find({ 'Year-Of-Publication': 2000 })
            .skip(skip)
            .limit(PAGE_SIZE);
        console.log(newReleases);
        res.status(200).json(newReleases);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

export {
    newReleases
}