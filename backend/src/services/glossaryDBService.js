const { ValidationError, NotFoundError } = require('../errors/AppError');

class glossaryDBService {
    constructor(glossaryModel) {
        this.glossaryModel = glossaryModel
    }
    async createEmptyCommunityGlossary(work_id) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        console.log(`📝 Creating empty community glossary for ${work_id}`)
        try {
            const emptyGlossary = await this.glossaryModel.addCommunityGlossary(work_id)
            if (!emptyGlossary) {
                throw new NotFoundError(`Book ${work_id}`)
            }
            return {
                ...emptyGlossary, message: `Empty community glossary created for ${work_id}`
            }
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Glossary exists')
            }
            throw error;
        }
    }
    async getGlossaryByWorkID(work_id) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        console.log(`🔍 Fetching community glossary of ${work_id}`)
        const glossary = await this.glossaryModel.fetchCommunityGlossaryByID(work_id)
        if (!glossary) {
            throw new NotFoundError(`Glossary for book ${work_id}`)
        }
        console.log(glossary)
        return {
            ...glossary, message: `Community glossary for ${work_id} found`
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
        const rowCount = await this.glossaryModel.updateCommunityGlossary(json, work_id)
        if (rowCount > 0) {
            return {
                success: true, message: `${rowCount} community glossary updated`
            }
        } else {
            // return { success: true, message: `Glossary not found in database` };
            throw new NotFoundError(`Glossary for book ${work_id}`)
        }
    }
}

module.exports = glossaryDBService;