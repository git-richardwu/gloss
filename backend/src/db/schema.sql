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
    work_id VARCHAR(20) PRIMARY KEY,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version_number INTEGER DEFAULT 1
    CONSTRAINT fk_communityGlossaries_book
        FOREIGN KEY (work_id)
        REFERENCES books(work_id) ON DELETE CASCADE
);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS cg_chapters (
    chapter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	work_id VARCHAR(20),
	chapter_name TEXT,
    position NUMERIC (10, 4) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_chapter_position
        UNIQUE (work_id, position)
	CONSTRAINT fk_glossary_chapter
		FOREIGN KEY (glossary_id)
		REFERENCES community_glossaries(glossary_id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS chapter_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    character_name TEXT NOT NULL,
    character_description TEXT,
    central_character BOOLEAN DEFAULT FALSE,
    work_id VARCHAR(20)
)
