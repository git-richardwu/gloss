import React, { useEffect, useState } from "react";
import type { Character, Chapter } from '../../types';
import styles from './EditChapter.module.css'
import { RiEdit2Fill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";

interface EditChapterProps {
    chapter: Chapter;
    work_id: string;
    onSave: (updatedChapter: Chapter) => void;
    onCancel: () => void;
    onDelete: () => void;
}

const EditChapter = ({ chapter, work_id, onSave, onCancel, onDelete }: EditChapterProps) => {

    const [editingChapter, setEditingChapter] = useState<Chapter>(chapter)

    useEffect(() => {
        setEditingChapter(chapter);
    }, [chapter])

    const handleSubmitChanges = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editingChapter);
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
            characters:[...editingChapter.characters,
                {name: "Character Name", description: "Placeholder", central_character: false}
            ]
        })
    }


    return (
        <form onSubmit={handleSubmitChanges} >
            <div className={styles.parent}>
                <div className={styles.chapter}>
                    <input className={styles.chapterInput} value={editingChapter.chapter_name} onChange={(e) => handleChapterNameChange(e.target.value)} required />
                    <button type="submit">SAVE</button>
                    <button type="button" onClick={onDelete}>DELETE</button>
                    <button type="button" onClick={onCancel}>CANCEL</button>
                </div>
                <div>
                    {
                        editingChapter.characters.map((character: Character, index: number) => (
                            <div key={`${work_id}_${chapter.chapter_name}_${index}`}>

                                <div className={styles.content}>
                                    <div>
                                        <input className={styles.name} value={character.name} onChange={(e) => handleCharacterChange(index, 'name', e.target.value)} required />
                                        {/* <FaTrashAlt onClick={() => handleRemoveCharacter(index)} className={styles.icon} /> */}
                                        <button type="button" onClick={() => handleRemoveCharacter(index)}>DELETE CHARACTER</button>
                                    
                                    </div>
                                    <textarea className={styles.description} value={character.description} onChange={(e) => handleCharacterChange(index, 'description', e.target.value)} required />
                                </div>
                            </div>
                        ))
                    }
                    <button type="button" onClick={handleAddCharacter}>ADD CHARACTER</button>

                </div>
            </div>
        </form>
    )
}

export default EditChapter;
