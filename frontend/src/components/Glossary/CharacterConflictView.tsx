import React, { useState } from 'react';
import type { CharacterConflict } from '../../types';
import styles from './ConflictResolve.module.css'

type ResolutionChoice = 'ours' | 'theirs';

interface CharacterConflictViewProps {
    conflict: CharacterConflict;
    resolutions: { [field: string]: ResolutionChoice } | undefined;
    onFieldChoice: (field: string, choice: ResolutionChoice) => void;
}

const CharacterConflictView: React.FC<CharacterConflictViewProps> = ({
    conflict,
    resolutions,
    onFieldChoice
}) => {
    const getConflictDescription = (): string => {
        switch (conflict.type) {
            case 'added_by_us':
                return `You added "${conflict.ours?.character_name}"`;
            case 'added_by_them':
                return `They added "${conflict.theirs?.character_name}"`;
            case 'modified':
                return `Modified "${conflict.character_name}"`;
            default:
                return 'Unknown change';
        }
    };

    const getChoiceButton = (choice: ResolutionChoice, label: string) => (
        <button
            onClick={() => onFieldChoice('add', choice)}
            className={resolutions?.add === choice
                ? styles.activeChoice : styles.choiceButton}
        >
            {label}
        </button>
    );

    return (
        <div className={styles.characterConflict}>
            <h4>{getConflictDescription()}</h4>

            {conflict.type === 'added_by_us' && (
                <div className={styles.addConflict}>
                    <p>This character doesn't exist in the other version.</p>
                    {getChoiceButton('ours', 'Keep')}
                    {getChoiceButton('theirs', 'Remove (Their Version)')}
                </div>
            )}

            {conflict.type === 'added_by_them' && (
                <div className={styles.addConflict}>
                    <p>They added this character. It's not in your version.</p>
                    {getChoiceButton('theirs', 'Accept')}
                    {getChoiceButton('ours', 'Remove (My Version)')}
                </div>
            )}

            {conflict.type === 'modified' && conflict.differences && (
                <div className={styles.modifyConflict}>
                    {Object.entries(conflict.differences).map(([field, values]) => (
                        <div key={field} className={styles.fieldConflict}>
                            <h4>{formatFieldName(field)}</h4>
                            <div className={styles.comparisonRow}>
                                <div className={styles.version}>
                                    <label>Yours:</label>
                                    <span>{String(values.ours)}</span>
                                    <button
                                        onClick={() => onFieldChoice(field, 'ours')}
                                        className={resolutions?.[field] === 'ours'
                                            ? styles.activeChoice : styles.choiceButton}
                                    >
                                        ✓ Keep Yours
                                    </button>
                                </div>
                                <div className={styles.version}>
                                    <label>Theirs:</label>
                                    <span>{String(values.theirs)}</span>
                                    <button
                                        onClick={() => onFieldChoice(field, 'theirs')}
                                        className={resolutions?.[field] === 'theirs'
                                            ? styles.activeChoice : styles.choiceButton}
                                    >
                                        ✓ Keep Theirs
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

function formatFieldName(field: string): string {
    const fieldNames: Record<string, string> = {
        character_name: 'Character Name',
        character_description: 'Description',
        central_character: 'Central Character'
    };
    return fieldNames[field] || field;
}

export default CharacterConflictView;