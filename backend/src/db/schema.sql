CREATE TABLE IF NOT EXISTS books (
    work_id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    descript VARCHAR,
    cover_url VARCHAR,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_fully_added BOOLEAN DEFAULT FALSE,
    year_published INTEGER,
    num_of_user_glossaries INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_glossaries (
    glossary_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    work_id VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT FALSE,
    num_of_likes INTEGER DEFAULT 0,
    CONSTRAINT fk_userGlossaries_book
        FOREIGN KEY (work_id)
        REFERENCES books(work_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS community_glossaries (
    glossary_id SERIAL PRIMARY KEY,
    work_id VARCHAR(20) NOT NULL UNIQUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version_number INTEGER DEFAULT 1
    CONSTRAINT fk_communityGlossaries_book
        FOREIGN KEY (work_id)
        REFERENCES books(work_id) ON DELETE CASCADE
);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS cg_chapters (
    chapter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id VARCHAR(20) NOT NULL,
    chapter_name TEXT,
    position NUMERIC(10,4) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_chapter_position UNIQUE (position, work_id),
    CONSTRAINT fk_glossary_chapter
        FOREIGN KEY (work_id)
        REFERENCES community_glossaries(work_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chapter_characters (
    character_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL,
    character_name TEXT NOT NULL,
    character_description TEXT,
    central_character BOOLEAN DEFAULT FALSE,
    work_id VARCHAR(20),
    CONSTRAINT chapter_characters_chapter_id_fkey
        FOREIGN KEY (chapter_id)
        REFERENCES cg_chapters(chapter_id) ON DELETE CASCADE
);