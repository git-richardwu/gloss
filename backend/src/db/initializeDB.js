const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../database')

async function initializeDatabase() {
    try {
        const sqlPath = path.join(__dirname, 'schema.sql');
        const sql = await fs.readFile(sqlPath, 'utf8');
        await pool.query(sql);
        // console.log('Tables has been created');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        process.exit();
    }
}

// initializeDatabase();