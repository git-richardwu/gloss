import { useState } from "react";
import type { Chapter, Character } from '../../types';
import styles from './GlossarySection.module.css'
import ChapterExpandable from './ChapterExpandable'
import EditChapter from "./EditChapter";
import { IoIosSave } from "react-icons/io";

interface ChapterOperations {
    updateName: (chapterID: string, newName: string) => void;
    updatePosition: (chapterID: string, newPosition: number) => void;
    addChapter: (newChapter: Chapter) => void;
    deleteChapter: (chapterID: string) => void;
}

interface CharacterOperations {
    addCharacter: (chapterID: string, characterData: Character) => void;
    updateCharacter: (characterID: string, newCharacterData: Partial<Character>) => void;
    deleteCharacter: (characterID: string) => void;
}

interface GlossaryProps {
    glossary: Chapter[];
    work_id: string;
    chapterOps: ChapterOperations;
    characterOps: CharacterOperations;
    onSaveAll: () => Promise<void>;
    onCancelEdits: () => Promise<void>;
    isDirty: boolean;
}
const GlossarySection = ({ glossary, work_id, onSaveAll, onCancelEdits, chapterOps, characterOps, isDirty }: GlossaryProps) => {
    const [editingChapterIndex, setEditingChapterIndex] = useState<number | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [signalNew, setSignalNew] = useState<boolean>(false)

    const handleAddChapter = () => {
        if (editingChapterIndex !== null) {
            if (!confirm('Adding a new chapter will cancel your current edit. Continue?')) {
                return;
            }
            setEditingChapterIndex(null)
        }
        const lastChapter = glossary[glossary.length - 1];
        const lastChapterIndex = glossary.length;
        const copiedCharacters = lastChapter ? lastChapter.characters.map(char => ({
            ...char, character_id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        })) : [];
        chapterOps.addChapter({
            chapter_name: `Chapter ${lastChapterIndex + 1}`,
            chapter_id: `temp-${Date.now()}`, //temporary ID
            characters: copiedCharacters,
            position: lastChapterIndex,
            work_id: work_id
        })
        setSignalNew(true)
        setEditingChapterIndex(lastChapterIndex);
    }

    const handleDeleteChapter = (chapterID: string) => {
        chapterOps.deleteChapter(chapterID);
        const deletedIndex = glossary.findIndex(ch => ch.chapter_id === chapterID);
        if (editingChapterIndex === deletedIndex) {
            setEditingChapterIndex(null);
        }
    }

    const handleSaveAll = async () => {
        try {
            setSaving(true); //saving
            await onSaveAll();
            setEditingChapterIndex(null);
            setSignalNew(false)
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save glossary. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    const handleCancelEdits = async () => {
        await onCancelEdits();
        setEditingChapterIndex(null);
        setSignalNew(false)
    }

    if (saving) {
        return (
            <div className={styles.loading}>
                <IoIosSave className={styles.icon} />
                <h1>saving glossary...</h1>
            </div>
        )
    }

    return (
        <div className={styles.parent}>
            <button className="secondaryButton add" onClick={handleAddChapter}>add chapter</button>
            {isDirty && (
                <div>
                <button
                    onClick={handleSaveAll}
                    className={styles.saveButton}
                >
                    save all changes
                </button>
                <button
                    onClick={handleCancelEdits}
                    className={styles.saveButton}
                >
                    cancel all changes
                </button>
                </div>
            )}
            {/* <button onClick={() => setLoading(true)}>test loading</button> */}

            <div className={styles.glossarySection}>
                {glossary?.map((chapter: Chapter, chapterIndex: number) => (
                    <div key={`${chapter.chapter_id}`}>
                        {editingChapterIndex === chapterIndex ?
                            (<EditChapter
                                chapter={chapter} work_id={work_id}
                                chapterOps={chapterOps}
                                characterOps={characterOps}
                                onCancel={() => setEditingChapterIndex(null)}
                                // onDelete={() => handleDeleteChapter(chapterIndex)}
                                onDelete={() => handleDeleteChapter(chapter.chapter_id)}
                                isNew={signalNew}
                            />)
                            : (<ChapterExpandable
                                chapter={chapter}
                                work_id={work_id}
                                onEdit={() => setEditingChapterIndex(chapterIndex)} />)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GlossarySection;