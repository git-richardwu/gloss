import React, { useState } from "react";
import type { Character, Chapter } from '../../types';
import styles from './ChapterExpandable.module.css'

interface ChapterExpandableProps {
    chapter: Chapter;
    work_id: string;
    onEdit: () => void;
}

const ChapterExpandable = ({ chapter, work_id, onEdit }: ChapterExpandableProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    console.log("chapter")
    console.log(chapter)
    return (
        <div className={styles.parent}>
            <h2 className={[
                styles.chapter,
                isExpanded && styles.open
            ].filter(Boolean).join(" ")} chapter-label={`Char. Count: ${chapter.characters.length}`} onClick={() => setIsExpanded(!isExpanded)}>
                <span>{chapter.chapter_name}</span>
                {isExpanded ? <span>▲</span> : <span>▼</span>}
            </h2>
            {isExpanded && <button className="secondaryButton edit" onClick={onEdit}>edit chapter</button>}

            <div className={`${styles.contentWrapper} ${isExpanded ? styles.expanded : ''}`}>
                <div className={styles.contentInner}>
                    {isExpanded && <hr />}
                    {
                        chapter.characters.map((characterData: Character, index: number) => (
                            <div key={chapter.characters[index].character_id}>
                                {isExpanded && (
                                    <div className={styles.content}>
                                        <h5 className={characterData.central_character === true ? styles.centralName : styles.name}>{characterData.character_name}</h5>
                                        <p className={styles.description}>{characterData.character_description}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ChapterExpandable;
