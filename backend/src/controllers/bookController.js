const { ValidationError, NotFoundError, ExternalServiceError, DatabaseConnectionError, DuplicateError } = require('../errors/AppError');

class bookController {
    constructor(bookService, glossaryService) {
        this.bookService = bookService;
        this.glossaryService = glossaryService;
    }
    async fetchBooksFromOpenLibrarySearch(req, res) {
        try {
            const {q: query, limit} = req.query;
            const serviceRes = await this.bookService.searchOpenLibraryAndSave(query, limit || 10)
            res.status(200).json(serviceRes)
        } catch (error) {
            if (error instanceof DatabaseConnectionError) {
                res.status(503).json({ error: 'Database unavailable' })
            } else if (error instanceof ExternalServiceError) {
                res.status(503).json({ error: 'Book search service unavailable' })
            } else if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message })
            } else if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message })
            } else if (error instanceof DuplicateError) {
                res.status(409).json({ error: error.message })
            } else {
                console.error('Unexpected search controller error: ', error)
                res.status(500).json({ error: 'Internal service error' })
            }
        }
    }

    async fetchBookPage(req, res) {
        try {
            const { id } = req.params;
            const serviceRes = await this.bookService.getOrFetchDescription(id)
            const communityGlossary = await this.glossaryService.getOrCreateGlossary(id)
            res.status(200).json({details: serviceRes.book, glossary: communityGlossary.glossary})
        }
        catch (error) {
            if (error instanceof DatabaseConnectionError) {
                res.status(503).json({error: 'Database unavailable'})
            } else if (error instanceof ExternalServiceError) {
                res.status(503).json({error: 'Book search service unavailable'})
            } else if (error instanceof ValidationError) {
                res.status(400).json({error: error.message})
            } else {
                console.error('Unexpected search controller error: ', error)
                res.status(500).json({error: 'Internal service error'})
            }
        }
    }
}
module.exports = bookController;