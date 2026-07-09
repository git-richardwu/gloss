const { ValidationError, NotFoundError, DuplicateError, VersionConflictError } = require('../errors/AppError');
const ConflictDetector = require('./conflictDetector');
const MergeService = require('./mergeService');

class glossaryDBService {
    constructor(glossaryModel) {
        this.glossaryModel = glossaryModel;
        this.conflictDetector = new ConflictDetector();
        this.mergeService = new MergeService();
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

    async getVersionHistory(work_id) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        const versionHistory = await this.glossaryModel.getVersionHistoryList(work_id)
        return {
            success: true,
            version_history: versionHistory,
            message: `${work_id}'s version history found in database`
        }
    }

    async getVersionData(work_id, version_number) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        const versionHistory = await this.glossaryModel.getVersionData(work_id, version_number)
        return {
            success: true,
            snapshot_data: versionHistory.snapshot_data,
            message: `${work_id}'s version history found in database`
        }
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
        const glossary = await this.glossaryModel.fetchChaptersAndCharacters(work_id);
        const versionHistory = await this.glossaryModel.getVersionHistoryList(work_id);
        if (!glossary) {
            return {
                success: true,
                glossary: null,
                glossary_chapters: null,
                chapter_characters: null,
                message: `Community glossary for ${work_id} NOT found - create new one.`
            }
        }

        return {
            success: true,
            glossary: glossary,
            message: `Community glossary for ${work_id} found`
        }
    }


    async updateCommunityGlossary(json, work_id, newVersion) {
        if (!work_id) {
            throw new ValidationError('No work_id provided.')
        }
        if (typeof json !== 'object' || !json) {
            throw new ValidationError('No object provided.')
        }
        console.log(`✍️ Updating community glossary for ${work_id}`)
        console.log('with')
        console.log(json)

        const currentGlossary = await this.glossaryModel.fetchChaptersAndCharacters(work_id);
        if (!currentGlossary) throw new Error('Glossary not found!');

        if (currentGlossary.glossary_details.version_number !== newVersion) {
            console.log('Version conflict detected!');
            const conflicts = this.conflictDetector.detectConflicts(json, currentGlossary.glossary_chapters)

            if (this.conflictDetector.areChangesCompatible(conflicts)) {
                console.log('No conflicts - auto-merging');
                console.log(`Ours`)
                console.log(json)
                console.log(`In database`);
                console.log(currentGlossary)

                const merged = this.mergeService.autoMerge(json.glossary_chapters, currentGlossary.glossary_chapters);
                return await this.performUpdate(merged, work_id);
            }
            throw new VersionConflictError(
                conflicts,
                currentGlossary.glossary_chapters,
                json,
                currentGlossary.glossary_details.version_number
            );
        }
        return await this.performUpdate(json, work_id);
    }

    async resolveConflicts(work_id, ourGlossary, resolutions) {
        console.log("Resolving conflict")
        console.log(resolutions)
        return await this.performUpdate(resolutions, work_id);
    }

    async performUpdate(glossaryData, work_id) {
        console.log('from performUpdate')
        console.log(glossaryData)
        return await this.glossaryModel.transaction(async (trx) => {
            const existingChapters = await this.glossaryModel.fetchChapters(work_id);
            const existingChapterIDs = new Set(existingChapters.map(ch => ch.chapter_id));

            const incomingChapterIDs = new Set();
            const chapters = glossaryData || [];

            for (const chapter of chapters) {
                const realChapterID = this.glossaryModel.generateID(chapter.chapter_id);
                incomingChapterIDs.add(realChapterID);
                await this.glossaryModel.upsertChapter(work_id, {
                    ...chapter,
                    chapter_id: realChapterID
                }, trx);
                await this.syncCharacters(realChapterID, chapter.characters || [], work_id, trx);
            }
            for (const existingId of existingChapterIDs) {
                if (!incomingChapterIDs.has(existingId)) {
                    await this.glossaryModel.deleteChapter(existingId, trx)
                }
            }
            await this.glossaryModel.createSnapshot(work_id, trx);
            const updatedGlossary = await this.glossaryModel.fetchChaptersAndCharacters(work_id, trx);
            console.log(updatedGlossary)
            return {
                chapters: updatedGlossary.glossary_chapters,
                details: updatedGlossary.glossary_details,
                message: 'Glossary updated successfully'
            };
        })
    }

    async syncCharacters(chapter_id, incomingCharacters, work_id, trx) {
        const existingCharacters = await this.glossaryModel.fetchCharacters(chapter_id, trx);
        const existingCharacterIDs = new Set(existingCharacters.map(c => c.character_id));
        const incomingCharactersIDs = new Set();
        for (const character of incomingCharacters) {
            const realCharID = this.glossaryModel.generateID(character.character_id);
            incomingCharactersIDs.add(realCharID);

            await this.glossaryModel.upsertCharacter(chapter_id, {
                ...character,
                character_id: realCharID
            }, work_id, trx);
        }
        for (const existingId of existingCharacterIDs) {
            if (!incomingCharactersIDs.has(existingId)) {
                await this.glossaryModel.deleteCharacter(existingId, trx);
            }
        }
    }
}

module.exports = glossaryDBService;