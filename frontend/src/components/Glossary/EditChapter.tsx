import React, { useRef, useEffect, useState, useMemo } from "react";
import type { Character, Chapter } from '../../types';
import styles from './EditChapter.module.css'
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import DeletedChapter from "./DeletedChapter";

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

interface EditChapterProps {
    chapter: Chapter;
    work_id: string;
    onCancel: () => void;
    onDelete: () => void;
    chapterOps: ChapterOperations;
    characterOps: CharacterOperations;
    isNew: boolean;
}

interface UnsavedChapterChanges {
    chapter_name: boolean;
    characters: {
        added: boolean;
        removed: boolean;
        modified: boolean;
    }
    hasChanges: boolean;
    isNewChapter: boolean;
}

const EditChapter = ({ chapter, work_id, onCancel, onDelete, chapterOps, characterOps, isNew }: EditChapterProps) => {
    // const [editingChapter, setEditingChapter] = useState<Chapter>(chapter);
    // const [originalChapter, setOriginalChapter] = useState<Chapter>(chapter);
    const [editingChapter, setEditingChapter] = useState<Chapter>(() => ({
        ...chapter,
        characters: chapter.characters?.map(c => ({ ...c })) || []
    }));
    const [originalChapter] = useState<Chapter>(() => ({
        ...chapter,
        characters: chapter.characters?.map(c => ({ ...c })) || []
    }));
    const [deleted, setDeleted] = useState<boolean>(false);

    const unsavedChanges = useMemo<UnsavedChapterChanges>(() => {
        if (isNew) {
            return {
                chapter_name: true,
                characters: { added: true, removed: false, modified: false },
                hasChanges: true,
                isNewChapter: true
            };
        }

        const changes: UnsavedChapterChanges = {
            chapter_name: editingChapter.chapter_name !== originalChapter.chapter_name,
            characters: { added: false, removed: false, modified: false },
            hasChanges: false,
            isNewChapter: false
        };

        const originalChars = originalChapter.characters || [];
        const editingChars = editingChapter.characters || [];

        if (editingChars.length > originalChars.length) {
            changes.characters.added = true;
        }
        if (editingChars.length < originalChars.length) {
            changes.characters.removed = true;
        }

        for (let i = 0; i < Math.min(editingChars.length, originalChars.length); i++) {
            if (
                originalChars[i].character_name !== editingChars[i].character_name ||
                originalChars[i].character_description !== editingChars[i].character_description ||
                originalChars[i].central_character !== editingChars[i].central_character
            ) {
                changes.characters.modified = true;
                break;
            }
        }

        changes.hasChanges =
            changes.chapter_name ||
            changes.characters.added ||
            changes.characters.modified ||
            changes.characters.removed;

        return changes;
    }, [editingChapter, originalChapter, isNew]);

    const handleSubmitChanges = (e: React.FormEvent) => {
        e.preventDefault();

        if (!unsavedChanges.hasChanges) {
            onCancel();
            return;
        }

        if (unsavedChanges.chapter_name) {
            chapterOps.updateName(chapter.chapter_id, editingChapter.chapter_name);
        }

        if (unsavedChanges.characters.added ||
            unsavedChanges.characters.removed ||
            unsavedChanges.characters.modified) {

            const originalChars = originalChapter.characters || [];
            const editingChars = editingChapter.characters || [];

            if (unsavedChanges.characters.removed) {
                originalChars.forEach(originalChar => {
                    if (!editingChars.find(c => c.character_id === originalChar.character_id)) {
                        characterOps.deleteCharacter(originalChar.character_id);
                    }
                });
            }

            editingChars.forEach(editingChar => {
                const originalChar = originalChars.find(
                    c => c.character_id === editingChar.character_id
                );
                if (!originalChar) {
                    characterOps.addCharacter(chapter.chapter_id, editingChar);
                } else if (
                    originalChar.character_name !== editingChar.character_name ||
                    originalChar.character_description !== editingChar.character_description ||
                    originalChar.central_character !== editingChar.central_character
                ) {
                    characterOps.updateCharacter(editingChar.character_id, editingChar);
                }
            });
        }

        onCancel();
    };

    const handleChapterNameChange = (value: string) => {
        setEditingChapter({
            ...editingChapter,
            chapter_name: value
        })
        // chapterOps.updateName(chapter.chapter_id, value);
    }

    const handleCharacterChange = (index: number, field: keyof Character, value: string | boolean) => {
        const updatedChapters = [...editingChapter.characters];
        updatedChapters[index] = {
            ...updatedChapters[index],
            [field]: value
        };
        setEditingChapter(prev => ({
            ...prev,
            characters: updatedChapters
        }));

        // const character = editingChapter.characters[index];
        // characterOps.updateCharacter(character.character_id, { [field]: value });
    }

    const handleRemoveCharacter = (charId: string) => {
        setEditingChapter(prev => ({
            ...prev,
            characters: prev.characters.filter(char => char.character_id !== charId),
        }));
        // characterOps.deleteCharacter(charId);
    };

    const handleAddCharacter = () => {
        const newCharacter: Character = {
            character_id: `temp-${Date.now()}`,
            chapter_id: chapter.chapter_id,
            character_name: "Character Name",
            character_description: "Placeholder",
            central_character: false,
            work_id: work_id
        };

        setEditingChapter(prev => ({
            ...prev,
            characters: [...prev.characters, newCharacter]
        }));
        // characterOps.addCharacter(chapter.chapter_id, newCharacter);
    };

    const handleCancel = () => {
        onCancel();
        setEditingChapter(originalChapter);
    }
    const handleDeleteClick = () => {
        setDeleted(true);
    }

    return (
        <div>
            {deleted ? <DeletedChapter onConfirmDelete={onDelete} onCancel={handleCancel} /> : <form onSubmit={handleSubmitChanges}>
                <div className={styles.parentContainer} edit-label={`Now Editing: ${editingChapter.chapter_name}`}>
                    <button className="secondaryButton" type="submit">done</button>
                    <button className="secondaryButton" type="button" onClick={handleCancel}>cancel</button>
                    <hr />
                    {unsavedChanges.hasChanges && <h1>UNSAVED CHANGES</h1>}
                    <div className={styles.row}>
                        <input className={styles.chapterInput} value={editingChapter.chapter_name} onChange={(e) => handleChapterNameChange(e.target.value)} required />
                        <button type="button" className="secondaryButton deleteButton" onClick={handleDeleteClick}>delete chapter</button>
                    </div>
                    <div id="characterList">
                        {
                            editingChapter.characters.map((character: Character, index: number) => (
                                <div key={`${editingChapter.characters[index].character_id}_edit`}>
                                    <div className={styles.row}>
                                        <input className={styles.nameInput} value={character.character_name} onChange={(e) => handleCharacterChange(index, 'character_name', e.target.value)} required />
                                        <div className={styles.centralToggle}>
                                            <label>central character? </label>
                                            <input id="toggle" type="checkbox" checked={character.central_character} onChange={(e) => handleCharacterChange(index, 'central_character', e.target.checked)} />
                                        </div>
                                    </div>
                                    <div className={styles.row}>
                                        <textarea className={styles.description} value={character.character_description} onChange={(e) => handleCharacterChange(index, 'character_description', e.target.value)} required />
                                    </div>
                                    <div className={styles.row}>
                                        <button type="button" className="secondaryButton  deleteButton" onClick={() => handleRemoveCharacter(character.character_id)}>delete character</button>
                                    </div>
                                    <hr />
                                </div>
                            ))
                        }
                        <div className={styles.row}>
                            <button type="button" className="secondaryButton" onClick={handleAddCharacter}>add character</button>
                        </div>

                    </div>
                </div>
            </form>}
        </div>
    )
}

export default EditChapter;
