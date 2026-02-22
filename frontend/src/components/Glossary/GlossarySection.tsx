import React, { useState } from "react";
import type { Character, ChapterData, GlossaryData } from '../../types';
import styles from './GlossarySection.module.css'
import Expandable from './Expandable'

interface GlossaryProps {
    glossary: GlossaryData | null;
    work_id: string;
}

const GlossarySection = ({ glossary, work_id }: GlossaryProps) => {
    return (
        <div className={styles.parent}>
            {glossary?.chapters.map((chapterData: ChapterData) => (
                <Expandable key={work_id + "_" + chapterData.chapter} chapterData={chapterData} work_id={work_id}/>
            ))}
        </div>
    )
}

export default GlossarySection;