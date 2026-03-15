export interface Book {
    work_id: string;
    title: string;
    author: string;
    cover_url: string;
}

export interface BookReponse {
    success: boolean;
    books: Book[];
}

export interface BookDetails {
    work_id: string;
    title: string;
    author: string;
    descript: string;
    cover_url: string;
    year_published: number;
}

export interface BookPageResponse {
    success: boolean;
    details: BookDetails;
    glossary: GlossaryData;
}

export interface GlossaryUpdateResponse {
    success: boolean;
    glossary: GlossaryData;
    version: number;
    message?: string;
}

export interface GlossaryData {
    chapters: Chapter[];
}

export interface Chapter {
    chapter_name: string;
    characters: Character[];
}

export interface Character {
    name: string;
    description: string;
    central_character: boolean;
}


