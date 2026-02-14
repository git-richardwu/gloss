// const db = require('../db/database');
const { DatabaseConnectionError } = require('../errors/AppError')

class BookModel {
    constructor(db) {
        this.db = db
    }
    async findBookByWorkID(work_id) {
        if (!this.db) {
            throw new DatabaseConnectionError();
        }
        const query = `SELECT * FROM books WHERE work_id = $1`
        const res = await this.db.query(query, [work_id])
        return res.rows[0]
    }
    async findBookByName(name, limit) {
        if (!this.db) {
            throw new DatabaseConnectionError();
        }
        await this.db.query('CREATE EXTENSION IF NOT EXISTS pg_trgm')
        const query = `SELECT similarity(title, $1) as similarity_score, *
        FROM books
        WHERE similarity(title, $1) > 0.09
        ORDER BY similarity_score DESC
        LIMIT $2`
        const res = await this.db.query(query, [name, limit])
        return res.rows
    }
    async getAllBooks() {
        if (!this.db) {
            throw new DatabaseConnectionError();
        }
        const query = `SELECT * FROM books ORDER BY title DESC`;
        const result = await this.db.query(query);
        return result.rows
    }
    async saveBook(bookData) {
        if (!this.db) {
            throw new DatabaseConnectionError();
        }
        const { work_id, title, author, cover_url, year_published } = bookData;
        const query = `INSERT INTO books (work_id, title, author, cover_url, year_published, is_fully_added, num_of_user_glossaries)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
        const values = [work_id, title, author, cover_url, year_published, false, 0];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }
    async updateBookDesc(bookData) {
        if (!this.db) {
            throw new DatabaseConnectionError();
        }
        const { work_id, descript } = bookData;
        const query = `UPDATE books
        SET descript = $2, is_fully_added = true, updated_at = CURRENT_TIMESTAMP
        WHERE work_id = $1
        RETURNING *`
        const result = await this.db.query(query, [work_id, descript]);
        return result.rows[0];
    }
}

module.exports = BookModel;