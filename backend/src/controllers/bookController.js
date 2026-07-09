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
            return res.status(200).json(serviceRes)
        } catch (error) {
            if (error instanceof DatabaseConnectionError) {
                return res.status(503).json({ error: 'Database unavailable' })
            } else if (error instanceof ExternalServiceError) {
                return res.status(503).json({ error: 'Book search service unavailable' })
            } else if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message })
            } else if (error instanceof NotFoundError) {
                return res.status(404).json({ error: error.message })
            } else if (error instanceof DuplicateError) {
                return res.status(409).json({ error: error.message })
            } else {
                console.error('Unexpected search controller error: ', error)
                return res.status(500).json({ error: 'Internal service error' })
            }
        }
    }

    async fetchBookPage(req, res) {
        try {
            const { id } = req.params;
            const serviceRes = await this.bookService.getOrFetchDescription(id)
            const communityGlossary = await this.glossaryService.getOrCreateGlossary(id)
            const versionRes = await this.glossaryService.getVersionHistory(id)
            return res.status(200).json({details: serviceRes.book, glossary: communityGlossary.glossary, version_history: versionRes.version_history})
        }
        catch (error) {
            if (error instanceof DatabaseConnectionError) {
                return res.status(503).json({error: 'Database unavailable'})
            } else if (error instanceof ExternalServiceError) {
                return res.status(503).json({error: 'Book search service unavailable'})
            } else if (error instanceof ValidationError) {
                return res.status(400).json({error: error.message})
            } else {
                console.error('Unexpected search controller error: ', error)
                return res.status(500).json({error: 'Internal service error'})
            }
        }
    }
}
module.exports = bookController;