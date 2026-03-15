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

    return (
        <div className={styles.parent}>
            <h2 className={styles.chapter} onClick={() => setIsExpanded(!isExpanded)}>
                <span>{chapter.chapter_name}</span>
                {isExpanded ? <span>▲</span> : <span>▼</span>}
            </h2>
            {isExpanded && <button className={styles.edit} onClick={onEdit}>edit chapter</button>}

            <div>
                {isExpanded && <hr />}
                {
                    chapter.characters.map((characterData: Character, index: number) => (
                        <div key={`${work_id}_${chapter.chapter_name}_${index}`} >
                            {isExpanded && (
                                <div className={styles.content}>
                                    <h5 className={characterData.central_character === true ? styles.centralName : styles.name}>{characterData.name}</h5>
                                    <p className={styles.description}>{characterData.description}</p>
                                </div>
                            )}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ChapterExpandable;
