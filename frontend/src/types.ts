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

export interface GlossaryData {
    chapters: ChapterData[];
}

export interface ChapterData {
    chapter: string;
    characters: Character[];
}

export interface Character {
    name: string;
    description: string;
    central_character: boolean;
}


