const ConflictDetector = require('./conflictDetector');

class MergeService {
    constructor() {
        this.conflictDetector = new ConflictDetector();
    }

    autoMerge(ours, theirs) {
        const merged = JSON.parse(JSON.stringify(theirs));
        const ourChapters = ours || [];
        const theirChapters = theirs || [];

        const theirChapterMap = new Map(theirChapters.map(ch => [ch.chapter_id, ch]));
        const ourChapterMap = new Map(ourChapters.map(ch => [ch.chapter_id, ch]));

        for (const [id, chapter] of ourChapterMap) {
            if (!theirChapterMap.has(id)) {
                merged.push(JSON.parse(JSON.stringify(chapter)));
            }
        }

        for (const [id, chapter] of ourChapterMap) {
            if (theirChapterMap.has(id)) {
                const theirChapter = theirChapterMap.get(id);
                const conflict = this.conflictDetector.compareChapters(id, chapter, theirChapter);
                
                if (!conflict) {
                    const index = merged.glossary_chapters.findIndex(ch => ch.chapter_id === id);
                    if (index !== -1) {
                        merged.glossary_chapters[index] = JSON.parse(JSON.stringify(chapter));
                    }
                }
            }
        }

        return merged;
    }

    
}

module.exports = MergeService;