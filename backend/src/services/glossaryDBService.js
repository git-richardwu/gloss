const { ValidationError, NotFoundError, DuplicateError } = require('../errors/AppError');

class glossaryDBService {
    constructor(glossaryModel) {
        this.glossaryModel = glossaryModel
    }

    async getOrCreateGlossary(work_id) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        const searchDB = await this.getGlossaryByWorkID(work_id)
        if (searchDB.glossary === null) {
            console.log(searchDB.message)
            const newGlossary = await this.createEmptyCommunityGlossary(work_id)
            return newGlossary
        }
        return searchDB
    }

    async createEmptyCommunityGlossary(work_id) {
        console.log(`📝 Creating empty community glossary for ${work_id}`)
        try {
            const emptyGlossary = await this.glossaryModel.addCommunityGlossary(work_id)
            if (!emptyGlossary) {
                throw new NotFoundError(`Book ${work_id} not found`)
            }
            return {
                success: true,
                glossary: emptyGlossary,
                message: `Empty community glossary created for ${work_id}`
            }
        } catch (error) {
            if (error.code === '23505') {
                throw new DuplicateError()
            }
            if (error.code === '23503') {
                throw new ValidationError('Bad Request: Book ID not found in books table')
            }
            throw error;
        }
    }
    async getGlossaryByWorkID(work_id) {
        console.log(`🔍 Fetching community glossary of ${work_id}`)
        const glossary = await this.glossaryModel.fetchCommunityGlossaryByID(work_id)
        if (!glossary) {
            return {
                success: true,
                glossary: null,
                message: `Community glossary for ${work_id} NOT found - create new one.`
            }
        }
        return {
            success: true,
            glossary: glossary,
            message: `Community glossary for ${work_id} found`
        }
    }
    async updateCommunityGlossary(json, work_id) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        if (typeof json !== 'object' || !json) {
            throw new ValidationError('No object provided.')
        }
        console.log(`✍️ Updating community glossary for ${work_id}`)
        const glossary = await this.glossaryModel.updateCommunityGlossary(json, work_id)
        if (!glossary) {
            throw new NotFoundError(`Glossary for book ${work_id}`)
        } else {
            return {
                success: true, glossary: glossary, message: `${work_id}'s community glossary updated`
            }
        }
    }
}

module.exports = glossaryDBService;