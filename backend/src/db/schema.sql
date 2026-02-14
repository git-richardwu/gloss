CREATE TABLE IF NOT EXISTS books (
    work_id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors VARCHAR(255) NOT NULL,
    descript VARCHAR,
    cover_url VARCHAR,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_fully_added BOOLEAN DEFAULT FALSE,
    year_published INTEGER,
    num_of_user_glossaries INTEGER DEFAULT 0

);

CREATE TABLE IF NOT EXISTS user_glossaries (
    glossary_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    work_id VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    glossary_content JSONB,
    is_public BOOLEAN DEFAULT FALSE,
    num_of_likes INTEGER DEFAULT 0,
    CONSTRAINT fk_userGlossaries_book
        FOREIGN KEY (work_id)
        REFERENCES books(work_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS community_glossaries (
    glossary_id SERIAL PRIMARY KEY,
    work_id VARCHAR(20) UNIQUE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    glossary_content JSONB,
    CONSTRAINT fk_communityGlossaries_book
        FOREIGN KEY (work_id)
        REFERENCES books(work_id) ON DELETE CASCADE
);

