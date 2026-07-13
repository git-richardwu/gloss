const { ValidationError, NotFoundError, ExternalServiceError, DatabaseConnectionError, DuplicateError, VersionConflictError } = require('../errors/AppError');

class glossaryController {
    constructor(glossaryService) {
        this.glossaryService = glossaryService;
    }
    async updateGlossary(req, res) {
        try {
            const { userInputGlossaryContent, version } = req.body;
            const { id } = req.params
            // version update
            const responseObject = await this.glossaryService.updateCommunityGlossary(userInputGlossaryContent, id, version);
            return res.status(200).json(responseObject)
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
            } else if (error instanceof VersionConflictError) {
                return res.status(409).json({
                    error: error.message,
                    conflicts: error.conflicts,
                    currentGlossary: error.currentGlossary,
                    ourGlossary: error.ourGlossary,
                    databaseVersion: error.databaseVersion
                })
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

    async resolveConflicts(req, res) {
        try {
            const { work_id } = req.params;
            const { ourGlossary, resolutions } = req.body;
            const result = await this.glossaryService.resolveConflicts(
                work_id,
                ourGlossary,
                resolutions
            );
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error resolving conflicts:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async fetchVersion(req, res) {
        try {
            const { id, version } = req.params;
            const serviceRes = await this.glossaryService.getVersionData(id, version)
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

    async fetchRecents(req, res) {
        try {
            const serviceRes = await this.glossaryService.getRecentlyUpdated()
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