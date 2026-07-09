import React, { useState } from "react";
import type { Character, Chapter } from '../../types';
import styles from './ChapterExpandable.module.css'

type ViewMode = "current" | "history";

interface ChapterExpandableProps {
    chapter: Chapter;
    work_id: string;
    viewMode: ViewMode;
    onEdit: () => void;
}

const ChapterExpandable = ({ chapter, work_id, viewMode, onEdit }: ChapterExpandableProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    return (
        <div className={styles.parent}>
            <h2 className={[
                styles.chapter,
                isExpanded && styles.open
            ].filter(Boolean).join(" ")} chapter-label={`Char. Count: ${chapter.characters.length}`} onClick={() => setIsExpanded(!isExpanded)}>
                <span>{chapter.chapter_name}</span>
                <span className={`${styles.toggleIcon} ${isExpanded ? styles.rotated : ''}`}>
                    {isExpanded ? '▲' : '▼'}
                </span>
            </h2>
            {viewMode === "current" && (
            <div className={`${styles.editButtonWrapper} ${isExpanded ? styles.editVisible : ''}`}>
                <button className="secondaryButton edit" onClick={onEdit}>edit chapter</button>
            </div>)}

            <div className={`${styles.contentWrapper} ${isExpanded ? styles.expanded : ''}`}>
                <div className={styles.contentInner}>
                    <hr className={styles.divider} />
                    {chapter.characters.map((characterData: Character, index: number) => (
                        <div key={chapter.characters[index].character_id}>
                            <div className={styles.content}>
                                <h5 className={characterData.central_character === true ? styles.centralName : styles.name}>{characterData.character_name}</h5>
                                <p className={styles.description}>{characterData.character_description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChapterExpandable;
