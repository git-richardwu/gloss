
import React, { useState } from 'react';
import type { ConflictAnalysis, Chapter } from '../../types';
import styles from './ConflictResolve.module.css'
import ChapterConflictView from './ChapterConflictView'

interface ConflictResolverProps {
    conflicts: ConflictAnalysis;
    ourGlossary: Chapter[];
    theirGlossary: Chapter[];
    databaseVersion: number;
    onResolve: (resolvedGlossary: Chapter[]) => void;
    onCancel: () => void;
}

type ResolutionChoice = 'ours' | 'theirs';

interface Resolutions {
    [chapterId: string]: {
        chapter_name?: ResolutionChoice;
        characters: {
            [characterId: string]: {
                [field: string]: ResolutionChoice;
            };
        };
    };
}

export const ConflictResolveSection: React.FC<ConflictResolverProps> = ({
    conflicts,
    ourGlossary,
    theirGlossary,
    databaseVersion,
    onResolve,
    onCancel
}) => {
    const [resolutions, setResolutions] = useState<Resolutions>({});
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

    const handleChapterNameChoice = (chapterId: string, choice: ResolutionChoice) => {
        setResolutions(prev => ({
            ...prev,
            [chapterId]: {
                ...prev[chapterId],
                chapter_name: choice,
                characters: prev[chapterId]?.characters || {}
            }
        }));
    };

    const handleCharacterFieldChoice = (
        chapterId: string,
        characterId: string,
        field: string,
        choice: ResolutionChoice
    ) => {
        setResolutions(prev => ({
            ...prev,
            [chapterId]: {
                ...prev[chapterId],
                characters: {
                    ...prev[chapterId]?.characters,
                    [characterId]: {
                        ...prev[chapterId]?.characters?.[characterId],
                        [field]: choice
                    }
                }
            }
        }));
    };

    const areAllConflictsResolved = (): boolean => {
        if (!conflicts.hasConflicts) return true;

        for (const chapter of conflicts.chapterConflicts) {
            const chapterResolution = resolutions[chapter.chapter_id];

            if (chapter.chapter_name && !chapterResolution?.chapter_name) {
                return false;
            }

            for (const charConflict of chapter.characters) {
                const charResolution = chapterResolution?.characters?.[charConflict.character_id];

                if (charConflict.type === 'added_by_us') {
                    if (!charResolution?.['add']) {
                        return false;
                    }
                } else if (charConflict.type === 'added_by_them') {
                    if (!charResolution?.['add']) {
                        return false;
                    }
                } else if (charConflict.type === 'modified' && charConflict.differences) {
                    for (const field of Object.keys(charConflict.differences)) {
                        if (!charResolution?.[field]) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    };

    const allResolved = areAllConflictsResolved();

    const buildMergedGlossary = (): Chapter[] => {
        const merged: Chapter[] = [];

        const allChapterIds = new Set([
            ...ourGlossary.map(ch => ch.chapter_id),
            ...theirGlossary.map(ch => ch.chapter_id)
        ]);

        for (const chapterId of allChapterIds) {
            const ourChapter = ourGlossary.find(ch => ch.chapter_id === chapterId);
            const theirChapter = theirGlossary.find(ch => ch.chapter_id === chapterId);
            const resolution = resolutions[chapterId];

            if (ourChapter && !theirChapter) {
                merged.push(JSON.parse(JSON.stringify(ourChapter)));
                continue;
            }

            if (!ourChapter && theirChapter) {
                merged.push(JSON.parse(JSON.stringify(theirChapter)));
                continue;
            }

            if (ourChapter && theirChapter) {
                const mergedChapter: Chapter = {
                    ...theirChapter,
                    characters: []
                };

                if (resolution?.chapter_name === 'ours') {
                    mergedChapter.chapter_name = ourChapter.chapter_name;
                } else if (resolution?.chapter_name === 'theirs') {
                    mergedChapter.chapter_name = theirChapter.chapter_name;
                } else if (ourChapter.chapter_name !== theirChapter.chapter_name) {
                    console.log('No resolution')
                }

                const allCharIds = new Set([
                    ...ourChapter.characters.map(c => c.character_id),
                    ...theirChapter.characters.map(c => c.character_id)
                ]);

                for (const charId of allCharIds) {
                    const ourChar = ourChapter.characters.find(c => c.character_id === charId);
                    const theirChar = theirChapter.characters.find(c => c.character_id === charId);
                    const charResolution = resolution?.characters?.[charId];

                    if (ourChar && !theirChar) {
                        if (!charResolution || charResolution['add'] !== 'theirs') {
                            mergedChapter.characters.push(JSON.parse(JSON.stringify(ourChar)));
                        }
                        continue;
                    }

                    if (!ourChar && theirChar) {
                        if (!charResolution || charResolution['add'] !== 'ours') {
                            mergedChapter.characters.push(JSON.parse(JSON.stringify(theirChar)));
                        }
                        continue;
                    }

                    if (ourChar && theirChar) {
                        const mergedChar = JSON.parse(JSON.stringify(theirChar));

                        const fields = ['character_name', 'character_description', 'central_character'];
                        for (const field of fields) {
                            if ((ourChar as any)[field] !== (theirChar as any)[field]) {
                                const choice = charResolution?.[field];
                                if (choice === 'ours') {
                                    (mergedChar as any)[field] = (ourChar as any)[field];
                                }
                            }
                        }
                        mergedChapter.characters.push(mergedChar);
                    }
                }
                merged.push(mergedChapter);
            }
        }
        console.log('Final merged:', merged);
        return merged;
    };

    const handleSubmit = () => {
        const merged = buildMergedGlossary();
        console.log('📤 Sending merged glossary to parent:', merged);
        onResolve(merged);
    };

    const handleAcceptAllOurs = () => {
        onResolve(ourGlossary);
    };

    const handleAcceptAllTheirs = () => {
        onResolve(theirGlossary);
    };

    if (!conflicts.hasConflicts) {
        return (
            <div className={styles.container}>
                <h2>No Conflicts</h2>
                <p>There are no conflicting changes. Auto-merging is possible.</p>
                <button onClick={handleSubmit}>Continue</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>⚠️ Version Conflict Detected</h2>
                <p>
                    Someone else edited this glossary while you were working.
                    Review the conflicts below and choose which version to keep for each change.
                </p>
            </div>

            <div className={styles.quickActions}>
                <button
                    onClick={handleAcceptAllOurs}
                >
                    accept all my changes
                </button>
                <button
                    onClick={handleAcceptAllTheirs}
                >
                    accept all their changes
                </button>

            </div>
            <h2>OR</h2>
            <p className={styles.mergeDescription}>Pick and choose which changes to keep from each version.</p>
            <div className={styles.conflictList}>
                {conflicts.chapterConflicts.map(chapter => (
                    <ChapterConflictView
                        key={chapter.chapter_id}
                        conflict={chapter}
                        ourGlossary={ourGlossary}
                        theirGlossary={theirGlossary}
                        resolutions={resolutions[chapter.chapter_id]}
                        isSelected={selectedChapter === chapter.chapter_id}
                        onSelect={() => setSelectedChapter(
                            selectedChapter === chapter.chapter_id ? null : chapter.chapter_id
                        )}
                        onChapterNameChoice={(choice: ResolutionChoice) =>
                            handleChapterNameChoice(chapter.chapter_id, choice)
                        }
                        onCharacterFieldChoice={(charId: string, field: string, choice: ResolutionChoice) =>
                            handleCharacterFieldChoice(chapter.chapter_id, charId, field, choice)
                        }
                    />
                ))}
            </div>

            <div className={styles.footer}>
                <button className={!allResolved ? styles.disabledButton : ''}disabled={!allResolved} onClick={handleSubmit}>
                    {allResolved ? 'Apply Resolutions & Save' : 'Resolve All Conflicts to Save'}
                </button>
                <button onClick={onCancel} className="secondaryButton">
                    Cancel
                </button>
            </div>
        </div>
    );
};





export default ConflictResolveSection;