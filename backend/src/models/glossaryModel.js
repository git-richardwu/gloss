// const db = require('../database');
const { randomUUID } = require('crypto');

class GlossaryModel {
    constructor(db) {
        this.db = db
    }

    async transaction(callback) {
        const client = await this.db.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async incrementVersion(work_id, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `
            UPDATE community_glossaries 
            SET version_number = version_number + 1
            WHERE work_id = $1
            RETURNING version_number
        `;
        const newVersion = await client.query(query, [work_id]);
        return newVersion.rows[0].version_number
    }

    async addCommunityGlossary(work_id, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const sampleChaptersID = randomUUID();
        const sampleCharacterID = randomUUID();

        // create glossary
        const glossaryQuery = `INSERT INTO community_glossaries (work_id)
         VALUES ($1)
         RETURNING *`
        const glossaryResult = await this.db.query(glossaryQuery, [work_id]);
        // add sample chapter
        const chapterQuery = `INSERT INTO cg_chapters (chapter_id, work_id, chapter_name, position, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *`
        const chapterResult = await this.db.query(chapterQuery, [sampleChaptersID, work_id, "Placeholder Chapter", 0]);

        // add sample character
        const characterQuery = `INSERT INTO chapter_characters (character_id, chapter_id, character_name, character_description, central_character)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`
        const characterResult = await this.db.query(characterQuery, [sampleCharacterID, sampleChaptersID, "Character A", "Placeholder Text", true]);
        await this.createSnapshot(work_id, true);
        await client.query('COMMIT');
        console.log('Community glossary created successfully!!');
        return {
            glossary_details: glossaryResult.rows[0],
            glossary_chapters: [
                {
                    chapter_id: chapterResult.rows[0].chapter_id,
                    work_id: chapterResult.rows[0].work_id,
                    chapter_name: chapterResult.rows[0].chapter_name,
                    position: chapterResult.rows[0].position,
                    characters: [
                        {
                            character_id: characterResult.rows[0].character_id,
                            chapter_id: characterResult.rows[0].chapter_id,
                            work_id: characterResult.rows[0].work_id,
                            character_name: characterResult.rows[0].character_name,
                            character_description: characterResult.rows[0].character_description,
                            central_character: characterResult.rows[0].central_character
                        }
                    ]
                }
            ]
        }
    }

    async fetchCommunityGlossaryByID(work_id, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `SELECT * FROM community_glossaries WHERE work_id = $1`
        const res = await client.query(query, [work_id])
        return res.rows[0]
    }

    async fetchChaptersAndCharacters(work_id, client = this.db) { //initial
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `
        SELECT 
            json_build_object(
                'glossary_details', json_build_object(
                    'glossary_id', g.glossary_id,
                    'work_id', g.work_id,
                    'version_number', g.version_number
                ),
                'glossary_chapters', (
                    SELECT json_agg(
                        json_build_object(
                            'chapter_id', gc.chapter_id,
                            'work_id', gc.work_id,
                            'chapter_name', gc.chapter_name,
                            'position', gc.position,
                            'characters', COALESCE(
                                (
                                    SELECT json_agg(cc.*)
                                    FROM chapter_characters cc
                                    WHERE cc.chapter_id = gc.chapter_id
                                ),
                                '[]'::json
                            )
                        )
                        ORDER BY gc.position
                    )
                    FROM cg_chapters gc
                    WHERE gc.work_id = g.work_id
                )
            ) AS data
        FROM community_glossaries g
        WHERE g.work_id = $1
    `;
        const res = await client.query(query, [work_id]);
        return res.rows[0]?.data || null;
    }

    async createSnapshot(work_id, first_load, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const currentData = await this.fetchChaptersAndCharacters(work_id, client);
        if (!currentData) {
            throw new Error(`No glossary found for work_id: ${work_id}`);
        }
        const snapshot_ver = first_load ? 1 : await this.incrementVersion(work_id)
        // console.log(newVersionNumber)
        const query = `INSERT INTO version_history (work_id, version_number, snapshot_data)
        VALUES ($1, $2, $3)
        RETURNING version_id, version_number, created_at`;
        const res = await client.query(query, [work_id, snapshot_ver, currentData])
        return {
            version_id: res.rows[0].version_id,
            version_number: res.rows[0].version_number,
            created_at: res.rows[0].created_at,
            snapshot_data: currentData
        }
    }

    async getVersionHistoryList(work_id, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `SELECT version_number, created_at, jsonb_array_length(snapshot_data->'glossary_chapters') as chapter_count, snapshot_data
        FROM version_history
        WHERE work_id = $1
        ORDER BY version_number DESC`;
        let res = await client.query(query, [work_id])
        if (res.rows.length > 0) {
            const currentQuery = `SELECT version_number FROM community_glossaries WHERE work_id = $1`;
            const currentRes = await client.query(currentQuery, [work_id])
            const currentVersion = currentRes.rows[0]?.version_number;
            res.rows = res.rows.map(version => ({
                ...version,
                is_current: version.version_number === currentVersion
            }));
        } else {
            await this.createSnapshot(work_id, true);
            res = await client.query(query, [work_id]);
            if (res.rows.length > 0) {
                res.rows = res.rows.map(version => ({
                    ...version,
                    is_current: true
                }));
            }
        }
        return res.rows;
    }

    async getVersionData(work_id, version_number, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `SELECT snapshot_data
        FROM version_history
        WHERE work_id = $1 AND version_number = $2`;
        const res = await client.query(query, [work_id, version_number])
        return res.rows[0];
    }

    async fetchChapters(work_id, client = this.db) { // works
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `SELECT * FROM cg_chapters WHERE work_id = $1 ORDER BY position ASC`
        const res = await client.query(query, [work_id])
        return res.rows
    }

    async upsertChapter(work_id, chapter, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `
            INSERT INTO cg_chapters 
                (chapter_id, work_id, chapter_name, position)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (chapter_id) 
            DO UPDATE SET
                chapter_name = EXCLUDED.chapter_name,
                position = EXCLUDED.position,
                updated_at = NOW()
        `;
        const chapterResult = await client.query(query, [chapter.chapter_id, work_id, chapter.chapter_name, chapter.position]);
        return chapterResult.rows[0];
    }

    async deleteChapter(chapter_id, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `DELETE FROM cg_chapters
        WHERE chapter_id = $1
        RETURNING *`
        const result = await client.query(query, [chapter_id]);
        return result.rows[0];
    }

    async fetchCharacters(chapter_id, client = this.db) { // works
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `SELECT * FROM chapter_characters WHERE chapter_id = $1`
        const res = await client.query(query, [chapter_id])
        return res.rows
    }

    async upsertCharacter(chapter_id, character, work_id, client = this.db) {
        if (!client) {
            throw new DatabaseConnectionError();
        }
        const query = `
            INSERT INTO chapter_characters 
                (character_id, chapter_id, character_name, character_description, 
                 central_character, work_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (character_id) 
            DO UPDATE SET
                chapter_id = EXCLUDED.chapter_id,
                character_name = EXCLUDED.character_name,
                character_description = EXCLUDED.character_description,
                central_character = EXCLUDED.central_character
        `;

        const characterResult = await client.query(query, [
            character.character_id,
            chapter_id,
            character.character_name,
            character.character_description || '',
            character.central_character || false,
            work_id
        ]);
        return characterResult.rows[0];

    }
    async deleteCharacter(character_id, client = this.db) {
        const query = `DELETE FROM chapter_characters
        WHERE character_id = $1
        RETURNING *`
        const result = await client.query(query, [character_id]);
        return result.rows[0];
    }

    generateID(id) {
        if (!id || id.startsWith('temp-')) {
            return randomUUID();
        }
        return id;
    }
}

module.exports = GlossaryModel;

