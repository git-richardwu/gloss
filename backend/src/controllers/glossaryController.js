const { ValidationError, NotFoundError, ExternalServiceError, DatabaseConnectionError, DuplicateError } = require('../errors/AppError');

class glossaryController {
    constructor(glossaryService) {
        this.glossaryService = glossaryService;
    }
    async updateGlossary(req, res) {
        try {
            const { userInputGlossaryContent, version } = req.body;
            const { id } = req.params
            const responseObject = await this.glossaryService.getGlossaryByWorkID(id)

            if (responseObject.glossary.version_number !== version) {
                return res.status(409).json({ error: 'Conflict',
                    message: 'This glossary has been updated by another user',
                    currentGlossary: responseObject.glossary.glossary_content,
                    databaseVersion: responseObject.glossary.version_number,
                    yourVersion: version,
                    yourGlossary: userInputGlossaryContent
                 });
            }

            const updatedVersion = responseObject.glossary.version_number + 1
            const serviceRes = await this.glossaryService.updateCommunityGlossary(userInputGlossaryContent, id, updatedVersion)
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
    async fetchGlossary(req, res) {
        try {
            const { id } = req.params
            const serviceRes = await this.glossaryService.getGlossaryByWorkID(id)
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
    async createCommunityGlossary(req, res) {
        try {
            const { id } = req.params
            const serviceRes = await this.glossaryService.createEmptyCommunityGlossary(id)
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
}

module.exports = glossaryController