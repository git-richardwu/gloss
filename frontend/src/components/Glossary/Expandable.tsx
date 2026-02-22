import React, { useState } from "react";
import type { Character, ChapterData } from '../../types';
import styles from './Expandable.module.css'

interface ChapterProps {
    chapterData: ChapterData;
    work_id: string;
}

const Expandable = ({ chapterData, work_id }: ChapterProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <div className={styles.parent}>
            <h2 className={styles.chapter} onClick={() => setIsExpanded(!isExpanded)}>{chapterData.chapter} </h2>
            <div>
                {
                    chapterData.characters.map((characterData: Character, index: number) => (
                        <div key={work_id + "_" + chapterData.chapter + "_" + index} >
                            {isExpanded && (
                                <div className={styles.content}>
                                    <h5 className={styles.name}>{characterData.name}</h5>
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

export default Expandable;
