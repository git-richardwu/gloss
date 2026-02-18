const { ValidationError, NotFoundError } = require('../errors/AppError');

class BookDBService {
    constructor(bookModel, openLibraryService) {
        this.bookModel = bookModel;
        this.openLibraryService = openLibraryService;
    }
    async searchOpenLibraryAndSave(query, limit = 10) {
        if (!query) {
            throw new ValidationError('Query is required');
        }
        const searchDB = await this.searchLocalDatabase(query, limit)
        const localResults = searchDB.books
        if (localResults.length < limit) {
            console.log(`🔍 Searching OpenLibrary for: "${query}" 🔍`);
            const searchRes = await this.openLibraryService.searchBooks(query, limit)
            if (searchRes.length === 0) {
                return {
                    success: true,
                    books: [],
                    summary: {},
                    receipt: {},
                    message: `No books found for "${query}"`
                }
            }
            const uniqueExternalRes = searchRes.filter(externalBook => !localResults.some(localBook =>
                localBook.work_id === externalBook.work_id
            ));
            const queryResults = await this.saveBooksToDatabase(uniqueExternalRes);
            const formattedLocal = localResults.map(({work_id, title, author, cover_url}) => ({work_id, title, author, cover_url}));
            const combinedLocalExternal = [...formattedLocal, ...queryResults.books].sort()
            return {
                success: true,
                books: combinedLocalExternal,
                summary: queryResults.summary,
                receipt: queryResults.receipt,
                message: `${combinedLocalExternal.length} books found for "${query}"`

            }
        }
        return {
            success: true,
            books: localResults,
            summary: {},
            receipt: {},
            message: `"${query}" found in database`

        }
    }

    async saveBooksToDatabase(unsavedBooks) {
        console.log(`Saving ${unsavedBooks.length} books`);
        if (unsavedBooks.length === 0) {
            throw new ValidationError('No books provided. Empty array.');
        }
        if (!Array.isArray(unsavedBooks)) {
            throw new ValidationError('Input is not of type array.')
        }
        const savePromises = unsavedBooks.map(async (book) => {
            if (!book.work_id || !book.title) {
                return {
                    ...book,
                    work_id: null,
                    existed: false,
                    success: false,
                    error: 'Invalid book data',
                    message: 'Missing required fields'
                }
            }
            try {
                const existingBook = await this.bookModel.findBookByWorkID(book.work_id)
                if (existingBook) {
                    console.log(`${book.title} already stored in database`)
                    return {
                        ...book,
                        work_id: book.work_id,
                        existed: true,
                        success: true,
                        message: 'Already in database'
                    };
                }
                console.log(`Saving new book: ${book.title}`)
                const newlySavedBook = await this.bookModel.saveBook(book)
                return {
                    ...newlySavedBook,
                    work_id: book.work_id,
                    existed: false,
                    success: true,
                    message: '✔️ Successfully added in database'
                }
            } catch (error) {
                console.error(`${book.title} could not be processed`)
                return {
                    ...book,
                    work_id: book.work_id,
                    existed: false,
                    success: false,
                    message: '❌ Failed to add to database'
                };
            }
        })
        const results = await Promise.all(savePromises)
        const addedBooks = results.filter(r => r.success && !r.existed);
        const existingBooks = results.filter(r => r.success && r.existed);
        const failedBooks = results.filter(r => !r.success);
        const receipt = results.map(result => ({
            [result.title]: result.message
        }))
        return {
            success: true,
            summary: {
                totalProcessed: unsavedBooks.length,
                addedToDatabase: addedBooks.length,
                alreadyInDatabase: existingBooks.length,
                failed: failedBooks.length
            },
            details: {
                added: addedBooks,
                existing: existingBooks,
                failed: failedBooks
            },
            books: results.filter(r => r.success).map(({ work_id, title, author, cover_url }) => ({
                work_id, title, author, cover_url
            })),
            receipt: receipt
        }
    }

    async loadOpenLibraryDescriptionAndSave(work_id) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        const searchDB = await this.getBookDetailsInDatabase(work_id)
        if (searchDB.is_fully_added == false && searchDB.descript == null) {
            console.log(`🔍 Loading description for: "${work_id}" 🔍`);
            const bookData = await this.openLibraryService.getBookDesc(work_id);
            if (!bookData) {
                return {
                    success: false,
                    book: {},
                    message: `${work_id} not found in OpenLibrary`
                }
            }
            const updateRes = await this.updateBookDescription(bookData)
            return {
                success: true,
                book: updateRes.res,
                message: `${work_id}'s description has been updated`
            }
        }
        return {
            success: true,
            book: searchDB,
            message: `${work_id} found in database`

        }
    }

    async updateBookDescription(bookData) {
        console.log(`Updating description for ${bookData.work_id}`)
        const updatedBook = await this.bookModel.updateBookDesc(bookData)
        if (!updatedBook) {
            return {
                res: {},
                success: false,
                message: `Book ${bookData.work_id} not found in database`
            }
        }
        return {
            res: updatedBook,
            success: true,
            message: `Updated description for ${bookData.work_id} in database`
        }
    }

    async getBookDetailsInDatabase(work_id) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        console.log(`Grabbing full book details for ${work_id}`)
        const book = await this.bookModel.findBookByWorkID(work_id)
        if (!book) {
            throw new NotFoundError(`Book ${work_id}`)
        }
        return book
    }

    async searchLocalDatabase(query, limit) {
        console.log(`🔍 Searching database for: "${query}" 🔍`);
        const searchRes = await this.bookModel.findBookByName(query, limit)
        if (searchRes.length === 0) {
            return {
                books: [],
                message: `No books found for "${query} in database"`
            }
        }
        return {
            books: searchRes,
            message: `${searchRes.length} books matching "${query}" found in database`
        }
    }
}

module.exports = BookDBService;