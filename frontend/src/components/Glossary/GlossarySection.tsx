import { useState } from "react";
import type { Chapter, GlossaryData } from '../../types';
import styles from './GlossarySection.module.css'
import ChapterExpandable from './ChapterExpandable'
import EditChapter from "./EditChapter";
import { IoIosSave } from "react-icons/io";

interface GlossaryProps {
    glossary: GlossaryData;
    work_id: string;
    onGlossaryChange: (updatedGlossary: GlossaryData) => void;
    onUpdateGlossaryDB: (index: number, updatedChapter: Chapter) => Promise<void>;
}
const GlossarySection = ({ glossary, work_id, onGlossaryChange, onUpdateGlossaryDB }: GlossaryProps) => {

    const [editingChapterIndex, setEditingChapterIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [signalNew, setSignalNew] = useState<boolean>(false)

    const handleAddChapter = () => {
        if (editingChapterIndex) {
            if (!confirm('Adding a new chapter will delete your unsaved')) {
                return;
            }
            setEditingChapterIndex(null)
        }
        const lastChapterIndex = glossary.chapters.length;
        const newChapter: Chapter = {
            chapter_name: `Chapter ${lastChapterIndex}`,
            characters: glossary.chapters[lastChapterIndex - 1].characters
        }
        onGlossaryChange({
            ...glossary,
            chapters: [...glossary.chapters, newChapter]
        })
        setSignalNew(true)
        setEditingChapterIndex(lastChapterIndex);
    }

    const handleDeleteChapter = (index: number) => {
        if (confirm('Delete this chapter?')) {
            const updatedChapters = glossary.chapters.filter((_, i) => i !== index)
            onGlossaryChange({
                ...glossary,
                chapters: updatedChapters ?? []
            });
        }
    }

    const handleSaveLoading = async (chapterIndex: number, updatedChapter: Chapter) => {
        try {
            setLoading(true);
            await onUpdateGlossaryDB(chapterIndex, updatedChapter);
        } catch (error) {
            console.log(`Saving failed for chapter ${chapterIndex}:`, error);
        } finally {
            setSignalNew(false)
            setLoading(false);
            setEditingChapterIndex(null);
        }
    }

    if (loading) {
        return (
            <div className={styles.loading}>
                <IoIosSave className={styles.icon}/>
                <h1>saving glossary...</h1>
                <button onClick={() => setLoading(false)}>test loading</button>
            </div>
        )
    }

    return (
        <div className={styles.parent}><h1>Community Glossary</h1>
            <button onClick={handleAddChapter}>add chapter</button>
            <button onClick={() => setLoading(true)}>test loading</button>

            <div className={styles.glossarySection}>
                {glossary.chapters.map((chapter: Chapter, chapterIndex: number) => (
                    <div key={`${work_id}_${chapter.chapter_name}`}>
                        {editingChapterIndex === chapterIndex ?
                            (<EditChapter
                                chapter={chapter} work_id={work_id}
                                onSave={(updatedChapter) => handleSaveLoading(chapterIndex, updatedChapter)}
                                onCancel={() => setEditingChapterIndex(null)}
                                onDelete={() => handleDeleteChapter(chapterIndex)}
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