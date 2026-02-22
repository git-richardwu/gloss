const { ValidationError, NotFoundError, ExternalServiceError, DatabaseConnectionError, DuplicateError } = require('../errors/AppError');

class glossaryController {
    constructor(glossaryService) {
        this.glossaryService = glossaryService;
    }
    async updateGlossary(req, res) {
        try {
            const { userInput } = req.query;
            const { id } = req.params
            const serviceRes = await this.glossaryService.updateCommunityGlossary(userInput, id)
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
    async fetchGlossary(req, res) {
        try {
            const { id } = req.params
            const serviceRes = await this.glossaryService.getGlossaryByWorkID(id)
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
    async createCommunityGlossary(req, res) {
        try {
            const { id } = req.params
            const serviceRes = await this.glossaryService.createEmptyCommunityGlossary(id)
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
}

module.exports = glossaryController