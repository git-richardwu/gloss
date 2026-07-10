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

export interface GlossaryDetails {
    work_id: string;
    glossary_id: number;
    version_number: number;
}

export interface Snapshot {
    glossary_details: GlossaryDetails;
    glossary_chapters: Chapter[];
}

export interface Versions {
    version_number: number,
    created_at: string,
    chapter_count: number,
    snapshot_data: Snapshot,
    is_current?: boolean
}

export interface BookPageResponse {
    success: boolean;
    openLibraryDetails: BookDetails;
    glossary_chapters: Chapter[];
    versionNum: number;
    version_history: Versions[]
}

export interface GlossaryUpdateResponse {
    success: boolean;
    glossary_chapters: Chapter[];
    version: number;
    version_history: Versions[];
    message?: string;
}

// export interface GlossaryData {
//     chapters: Chapter[];
// }

export interface Chapter {
    chapter_id: string;
    chapter_name: string;
    characters: Character[];
    position: number;
    work_id: string;
}

export interface Character {
    chapter_id: string;
    character_name: string;
    character_id: string;
    character_description: string;
    central_character: boolean;
    work_id: string;
}

// export interface ChapterConflict {
//     ourChapter: Chapter;
//     theirChapter: Chapter;
//     chapterIndex: number;
//     chapterName: string;
//     differences: {
//         conflictDescription: string;
//         ourValue: any;
//         theirValue: any;
//     }[];
// }

export interface ConflictingData {
    ours: Chapter[];
    theirs: Chapter[];
    theirVersion: number;
    conflicts: ChapterConflict[]
}

export interface FieldConflict {
    ours: string | boolean;
    theirs: string | boolean;
}

export interface CharacterConflict {
    character_id: string;
    type: 'added_by_them' | 'added_by_us' | 'modified';
    character_name?: string;
    ours?: Character;
    theirs?: Character;
    differences?: Record<string, FieldConflict>;
}

export interface ChapterConflict {
    chapter_id: string;
    chapter_name: FieldConflict | null;
    characters: CharacterConflict[];
    hasConflict: boolean;
}

export interface NonConflictingChange {
    type: 'chapter_added' | 'chapter_deleted';
    chapter_id: string;
    chapter_name: string;
}

export interface ConflictAnalysis {
    hasConflicts: boolean;
    chapterConflicts: ChapterConflict[];
    characterConflicts: CharacterConflict[];
    nonConflictingChanges: {
        ours: NonConflictingChange[];
        theirs: NonConflictingChange[];
    };
}

export interface CharacterResolution {
    character_id: string;
    field: string;
    choice: 'ours' | 'theirs';
}

export interface ChapterResolution {
    chapter_id: string;
    decisions: {
        chapter_name?: 'ours' | 'theirs';
        characters: CharacterResolution[];
    };
}