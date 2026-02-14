const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    allowExitOnIdle: false,
})

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Postgresql connected!');
        release();
    }
});

async function onLaunch() {
    const client = await pool.connect();
    try {
        await client.query('SELECT NOW()')
        console.log('Database connected')
        // const res = await client.query('SELECT * FROM books LIMIT 1');
        // console.log(res.rows[0])
    } catch (error) {
        console.log('Query error:', error.message)
    } finally {
        client.release();
    }
}

onLaunch().catch(console.error);

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};