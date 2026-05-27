class ConflictDetector {
    
    detectConflicts(ours, theirs) { //Chapter[]
        console.log("CONFLICT DETECTED")
        const conflicts = { //ConflictAnalysis
            hasConflicts: false,
            chapterConflicts: [],
            characterConflicts: [],
            nonConflictingChanges: {
                ours: [],
                theirs: []
            }
        };

        const ourChapters = ours || [];
        const theirChapters = theirs || [];

        const ourChapterMap = new Map(ourChapters.map(ch => [ch.chapter_id, ch]));
        const theirChapterMap = new Map(theirChapters.map(ch => [ch.chapter_id, ch]));

        const allChapterIDs = new Set([
            ...ourChapters.map(ch => ch.chapter_id),
            ...theirChapters.map(ch => ch.chapter_id)
        ]);

        for (const chapterID of allChapterIDs) {
            const ourChapter = ourChapterMap.get(chapterID);
            const theirChapter = theirChapterMap.get(chapterID);

            if (!ourChapter && theirChapter) {
                console.log("They added a chapter that we don't have");
                conflicts.nonConflictingChanges.theirs.push({
                    type: 'chapter_added',
                    chapter_id: chapterID,
                    chapter_name: theirChapter.chapter_name
                });
            } else if (ourChapter && !theirChapter) {
                console.log("We added a chapter they don't have");
                conflicts.nonConflictingChanges.ours.push({
                    type: 'chapter_added',
                    chapter_id: chapterID,
                    chapter_name: ourChapter.chapter_name
                });
            } else if (ourChapter && theirChapter) {
                console.log("Both have this chapter - check for conflicts");
                const chapterConflict = this.compareChapters(chapterID, ourChapter, theirChapter);
                if (chapterConflict) {
                    conflicts.chapterConflicts.push(chapterConflict);
                    conflicts.hasConflicts = true;
                }
            }
        }
        return conflicts;
    }


    compareChapters(chapterID, ourChapter, theirChapter) {
        const conflict = { //ChapterConflict
            chapter_id: chapterID,
            chapter_name: null,
            characters: [],
            hasConflict: false
        };

        if (ourChapter.chapter_name !== theirChapter.chapter_name) {
            conflict.chapter_name = {
                ours: ourChapter.chapter_name,
                theirs: theirChapter.chapter_name
            };
            conflict.hasConflict = true;
        }

        const ourChars = ourChapter.characters || [];
        const theirChars = theirChapter.characters || [];

        const ourCharMap = new Map(ourChars.map(c => [c.character_id, c]));
        const theirCharMap = new Map(theirChars.map(c => [c.character_id, c]));

        const allCharIds = new Set([
            ...ourChars.map(c => c.character_id),
            ...theirChars.map(c => c.character_id)
        ]);

        for (const charId of allCharIds) {
            const ourChar = ourCharMap.get(charId);
            const theirChar = theirCharMap.get(charId);

            if (!ourChar && theirChar) {
                console.log("They added a character");
                conflict.characters.push({
                    character_id: charId,
                    type: 'added_by_them',
                    theirs: theirChar
                });
            } else if (ourChar && !theirChar) {
                console.log("We added a character");
                conflict.characters.push({
                    character_id: charId,
                    type: 'added_by_us',
                    ours: ourChar
                });
            } else if (ourChar && theirChar) {
                console.log("Both have this character - check for changes")
                const charDiff = this.compareCharacters(charId, ourChar, theirChar);
                if (charDiff) {
                    conflict.characters.push(charDiff);
                    conflict.hasConflict = true;
                }
            }
        }
        return conflict.hasConflict ? conflict : null;
    }

    compareCharacters(charId, ourChar, theirChar) {
        const fields = ['character_name', 'character_description', 'central_character'];
        const differences = {};

        for (const field of fields) {
            if (ourChar[field] !== theirChar[field]) {
                differences[field] = {
                    ours: ourChar[field],
                    theirs: theirChar[field]
                };
            }
        }

        if (Object.keys(differences).length > 0) {
            return { //CharacterConflict
                character_id: charId,
                type: 'modified',
                character_name: ourChar.character_name || theirChar.character_name,
                differences
            };
        }

        return null;
    }

    areChangesCompatible(conflicts) {
        return !conflicts.hasConflicts;
    }
}

module.exports = ConflictDetector;