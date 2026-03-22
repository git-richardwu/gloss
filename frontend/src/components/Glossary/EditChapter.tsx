import React, { use, useEffect, useState } from "react";
import type { Character, Chapter } from '../../types';
import styles from './EditChapter.module.css'
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";
import DeletedChapter from "./DeletedChapter";

interface EditChapterProps {
    chapter: Chapter;
    work_id: string;
    onSave: (updatedChapter: Chapter) => void;
    onCancel: () => void;
    onDelete: () => void;
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

const EditChapter = ({ chapter, work_id, onSave, onCancel, onDelete, isNew }: EditChapterProps) => {
    const [editingChapter, setEditingChapter] = useState<Chapter>(chapter);
    const [originalChapter, setOriginalChapter] = useState<Chapter>(chapter);
    const [deleted, setDeleted] = useState<boolean>(false);
    const [unsavedChanges, setUnsavedChanges] = useState<UnsavedChapterChanges>({
        chapter_name: false,
        characters: {
            added: false,
            removed: false,
            modified: false,
        },
        hasChanges: isNew,
        isNewChapter: isNew
    })

    useEffect(() => {
        setEditingChapter(chapter);
        setOriginalChapter(chapter);
        setUnsavedChanges(prev => ({
            ...prev,
            hasChanges: isNew
        }))
    }, [chapter, isNew])

    useEffect(() => {
        if (isNew) {
            setUnsavedChanges({
                chapter_name: true,
                characters: {
                    added: true,
                    removed: false,
                    modified: false,
                }, hasChanges: true,
                isNewChapter: true
            });
            return;
        }
        const changes: UnsavedChapterChanges = {
            chapter_name: editingChapter.chapter_name !== originalChapter.chapter_name,
            characters: {
                added: false,
                removed: false,
                modified: false,
            },
            hasChanges: false,
            isNewChapter: false
        }
        const originalChars = originalChapter.characters || []
        const editingChars = editingChapter.characters || []

        if (editingChars.length > originalChars.length) {
            changes.characters.added = true
        }

        if (editingChars.length < originalChars.length) {
            changes.characters.removed = true
        }
        for (let i = 0; i < Math.min(editingChars.length, originalChars.length); i++) {
            const editingChar = editingChars[i];
            const originalChar = originalChars[i];
            if (originalChar.name !== editingChar.name ||
                originalChar.description !== editingChar.description ||
                originalChar.central_character !== editingChar.central_character
            ) {
                changes.characters.modified = true;
                break;
            }
        }
        changes.hasChanges = changes.chapter_name || changes.characters.added || changes.characters.modified || changes.characters.removed;
        setUnsavedChanges(changes);
    }, [editingChapter, originalChapter, isNew])

    const handleSubmitChanges = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editingChapter);
        if (isNew) {
            setUnsavedChanges(prev => ({
                ...prev,
                isNewChapter: false,
                hasChanges: false
            }))
        }
        setDeleted(false);
    }

    const handleChapterNameChange = (value: string) => {
        setEditingChapter({
            ...editingChapter,
            chapter_name: value
        })
    }

    const handleCharacterChange = (index: number, field: keyof Character, value: string | boolean) => {
        const updatedChapters = [...editingChapter.characters];
        updatedChapters[index] = {
            ...updatedChapters[index],
            [field]: value
        };
        setEditingChapter({
            ...editingChapter,
            characters: updatedChapters
        })
    }

    const handleRemoveCharacter = (charIndex: number) => {
        setEditingChapter({
            ...editingChapter,
            characters: editingChapter.characters.filter((_, i) => i !== charIndex),
        })
    }

    const handleAddCharacter = () => {
        setEditingChapter({
            ...editingChapter,
            characters: [...editingChapter.characters,
            { name: "Character Name", description: "Placeholder", central_character: false }
            ]
        })
    }

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
            <div className={styles.parentContainer}>
                <button className={styles.editButton} type="submit">save</button>
                <button className={styles.editButton} type="button" onClick={handleCancel}>cancel</button>
                <hr />
                {unsavedChanges.hasChanges && <h1>UNSAVED CHANGES</h1>}
                <div className={styles.row}>
                    <input className={styles.chapterInput} value={editingChapter.chapter_name} onChange={(e) => handleChapterNameChange(e.target.value)} required />
                    <button type="button" onClick={handleDeleteClick}>delete chapter</button>
                </div>
                <div id="characterList">
                    {
                        editingChapter.characters.map((character: Character, index: number) => (
                            <div key={`${work_id}_${chapter.chapter_name}_${index}`}>
                                <div className={styles.row}>
                                    <input className={styles.nameInput} value={character.name} onChange={(e) => handleCharacterChange(index, 'name', e.target.value)} required />
                                    <div className={styles.centralToggle}>
                                        <label>central character? </label>
                                        <input id="toggle" type="checkbox" checked={character.central_character} onChange={(e) => handleCharacterChange(index, 'central_character', e.target.checked)} />
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <textarea className={styles.description} value={character.description} onChange={(e) => handleCharacterChange(index, 'description', e.target.value)} required />
                                </div>
                                <div className={styles.row}>
                                    <button type="button" onClick={() => handleRemoveCharacter(index)}>delete character</button>
                                </div>
                                <hr />
                            </div>
                        ))
                    }
                    <div className={styles.row}>
                        <button type="button" className={styles.editButton} onClick={handleAddCharacter}>add character</button>
                    </div>

                </div>
            </div>
        </form>}
        </div>
    )
}

export default EditChapter;
