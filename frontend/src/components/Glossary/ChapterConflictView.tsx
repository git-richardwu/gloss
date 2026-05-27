import CharacterConflictView from './CharacterConflictView';
import type { ChapterConflict, Chapter } from '../../types';
import styles from './ConflictResolve.module.css'

type ResolutionChoice = 'ours' | 'theirs';

interface Resolutions {
    [chapterId: string]: {
        chapter_name?: ResolutionChoice;
        characters: {
            [characterId: string]: {
                [field: string]: ResolutionChoice;
            };
        };
    };
}

interface ChapterConflictViewProps {
    conflict: ChapterConflict;
    ourGlossary: Chapter[];
    theirGlossary: Chapter[];
    resolutions: Resolutions[string] | undefined;
    isSelected: boolean;
    onSelect: () => void;
    onChapterNameChoice: (choice: ResolutionChoice) => void;
    onCharacterFieldChoice: (characterId: string, field: string, choice: ResolutionChoice) => void;
}

const ChapterConflictView: React.FC<ChapterConflictViewProps> = ({
    conflict,
    ourGlossary,
    theirGlossary,
    resolutions,
    isSelected,
    onSelect,
    onChapterNameChoice,
    onCharacterFieldChoice
}) => {
    const ourChapter = ourGlossary.find(
        ch => ch.chapter_id === conflict.chapter_id
    );
    const theirChapter = theirGlossary.find(
        ch => ch.chapter_id === conflict.chapter_id
    );

    return (
        <div className={`${styles.chapterConflict} ${isSelected ? styles.selected : ''}`}>
            <div className={styles.chapterHeader} onClick={onSelect}>
                <h3>
                    Chapter: {ourChapter?.chapter_name || theirChapter?.chapter_name}
                </h3>
                <span className={styles.expandIcon}>
                    {isSelected ? '▼' : '▶'}
                </span>
            </div>

            {isSelected && (
                <div className={styles.chapterDetails}>
                    {conflict.chapter_name && (
                        <div className={styles.fieldConflict}>
                            <h4>Chapter Name</h4>
                            <div className={styles.comparisonRow}>
                                <div className={styles.version}>
                                    <label>Yours:</label>
                                    <span>{conflict.chapter_name.ours as string}</span>
                                    <button
                                        onClick={() => onChapterNameChoice('ours')}
                                        className={resolutions?.chapter_name === 'ours'
                                            ? styles.activeChoice : styles.choiceButton}
                                    >
                                        ✓ Keep Yours
                                    </button>
                                </div>
                                <div className={styles.version}>
                                    <label>Theirs:</label>
                                    <span>{conflict.chapter_name.theirs as string}</span>
                                    <button
                                        onClick={() => onChapterNameChoice('theirs')}
                                        className={resolutions?.chapter_name === 'theirs'
                                            ? styles.activeChoice : styles.choiceButton}
                                    >
                                        ✓ Keep Theirs
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {conflict.characters.map(charConflict => (
                        <CharacterConflictView
                            key={charConflict.character_id}
                            conflict={charConflict}
                            resolutions={resolutions?.characters?.[charConflict.character_id]}
                            onFieldChoice={(field, choice) =>
                                onCharacterFieldChoice(charConflict.character_id, field, choice)
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChapterConflictView;