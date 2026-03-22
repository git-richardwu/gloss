import type { Chapter, ChapterConflict } from '../types'

export function findChapterConflicts(ourGlossary: { chapters: Chapter[] }, theirGlossary: { chapters: Chapter[] }): ChapterConflict[] {
    const conflicts: ChapterConflict[] = [];
    const maxLength = Math.max(ourGlossary.chapters.length, theirGlossary.chapters.length);
    
    for (let i = 0; i < maxLength; i++) {
        if (!ourGlossary.chapters[i] || !theirGlossary.chapters[i]) {
            conflicts.push({
                ourChapter: ourGlossary.chapters[i] || { chapter_name: '[MISSING]', characters: [] },
                theirChapter: theirGlossary.chapters[i] || { chapter_name: '[MISSING]', characters: [] },
                chapterIndex: i,
                chapterName: theirGlossary.chapters[i]?.chapter_name || ourGlossary.chapters[i]?.chapter_name || `Chapter ${i + 1}`,
                differences: [{
                    conflictDescription: "added/delete chapter",
                    ourValue: ourGlossary.chapters[i]?.chapter_name || '[MISSING]',
                    theirValue: theirGlossary.chapters[i]?.chapter_name || '[MISSING]'
                }]
            });
            continue;
        }
        
        const ourChapter = ourGlossary.chapters[i];
        const theirChapter = theirGlossary.chapters[i];
        const differences = [];
        
        if (ourChapter.chapter_name !== theirChapter.chapter_name) {
            differences.push({
                conflictDescription: "chapter name change",
                ourValue: ourChapter.chapter_name,
                theirValue: theirChapter.chapter_name
            });
        }
        
        if (JSON.stringify(ourChapter.characters) !== JSON.stringify(theirChapter.characters)) {
            differences.push({
                conflictDescription: "character detail change",
                ourValue: ourChapter.characters,
                theirValue: theirChapter.characters
            });
        }
        
        if (differences.length > 0) {
            conflicts.push({
                ourChapter,
                theirChapter,
                chapterIndex: i,
                chapterName: ourChapter.chapter_name,
                differences
            });
        }
    }
    
    return conflicts;
}