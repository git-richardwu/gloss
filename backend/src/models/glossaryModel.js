// const db = require('../database');

class GlossaryModel {
    constructor(db) {
        this.db = db
    }
    // static async addUserGlossary(gloss_id, user_id, work_id, updated_at, glossary_content, is_public, num_of_likes) {
    //     const query = `INSERT INTO user_glossaries (gloss_id, user_id, work_id, created_at, glossary_content, is_public, num_of_likes)
    //     VALUES ($1, $2, $3, $4, $5, $6, $7)
    //     RETURNING *`
    //     const values = [gloss_id, user_id, work_id, updated_at, glossary_content, is_public, num_of_likes];
    //     try {
    //         const res = await db.query(query, values);
    //         return res.rows[0]
    //     } catch (err) {
    //         console.error('Error adding glossary', err.stack);
    //         throw err;
    //     }
    // }
    // static async updateGlossary(gloss_id, updated_at, glossary_content) {
    //     const query = `UPDATE user_glossaries
    //     SET glossary_content = $3, updated_at = $2
    //     WHERE gloss_id = $1
    //     RETURN *`
    //     const values = [gloss_id, updated_at, glossary_content];
    //     try {
    //         const res = await db.query(query, values);
    //         return res.rows[0]
    //     } catch (err) {
    //         console.error('Error updating glossary', err.stack);
    //         throw err;
    //     }
    // }
    // static async deleteGlossary(gloss_id) {
    //     const query = `DELETE FROM user_glossaries WHERE gloss_id = $1
    //     RETURNING *`
    //     const res = await db.query(query, [gloss_id])
    //     return res.rows[0]
    // }
    async addCommunityGlossary(work_id) {
        const query = `INSERT INTO community_glossaries (work_id, glossary_content)
        VALUES ($1, $2::jsonb)
        RETURNING *`
        const values = [work_id, '{}'];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }
    async fetchCommunityGlossaryByID(work_id) {
        const query = `SELECT * FROM community_glossaries WHERE work_id = $1`
        const res = await this.db.query(query, [work_id])
        return res.rows[0]
    }
    async updateCommunityGlossary(json, work_id) {
        const query = `UPDATE community_glossaries
        SET glossary_content = $1
        WHERE work_id = $2`
        const result = await this.db.query(query, [json, work_id]);
        return result.rowCount;
    }
}

module.exports = GlossaryModel;