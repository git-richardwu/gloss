
import type { Chapter, ConflictingData, GlossaryData } from '../../types';
import styles from './ConflictResolve.module.css'


interface ConflictProps {
    conflictingData: ConflictingData | null
    onResolve: (choice: 'ours' | 'theirs' | 'merged') => void;
}

const ConflictResolveSection = ({ conflictingData, onResolve }: ConflictProps) => {

    if (conflictingData) {
        const { ours, theirs, theirVersion, conflicts } = conflictingData
        // console.log(ours)
        console.log(conflicts)


        return (
            <div>
                <h3>Conflict Detected</h3>
                <p>Someone else saved changes while you were editing.</p>
                <br />
                {conflicts.map((conflict, index) => (
                    <div key={index}>
                        <h2>Conflict at : {conflict.chapterName}</h2>
                        <div className={styles.flexParent}>
                            <div className={styles.column}>
                                <h1>MY CHANGES</h1>
                                <h2 className={styles.chapter}>{conflict.ourChapter.chapter_name}</h2>
                                <ul>
                                    {conflict.ourChapter.characters.map((char, charIndex) => (
                                        <ul key={charIndex}>
                                            <h5 className={char.central_character === true ? styles.centralName : styles.name}>{char.name}</h5>
                                            <p className={styles.description}>{char.description}</p>
                                        </ul>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.column}>
                                <h1>THEIR CHANGES</h1>
                                 <h2 className={styles.chapter}>{conflict.theirChapter.chapter_name}</h2>
                                <ul>
                                    {conflict.theirChapter.characters.map((char, charIndex) => (
                                        <ul key={charIndex}>
                                            <h5 className={char.central_character === true ? styles.centralName : styles.name}>{char.name}</h5>
                                            <p className={styles.description}>{char.description}</p>
                                            <div>{char.central_character}</div>
                                        </ul>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <ul>
                                <h3>Conflict Type</h3>
                                {conflict.differences.map((diff, diffIndex) => (
                                    <ul key={diffIndex}>
                                        <div>{diff.conflictDescription}</div>
                                    </ul>
                                ))}
                            </ul>
                            <hr />
                            <br />
                        </div>
                    </div>

                ))}
                <div className="actions">
                    <button onClick={() => onResolve('ours')}>
                        Keep Mine (Overwrite Theirs)
                    </button>
                    <button onClick={() => onResolve('theirs')}>
                        Accept Theirs (Discard My Changes)
                    </button>
                    <button onClick={() => onResolve('merged')}>
                        Merge Manually
                    </button>
                </div>
            </div>
        );
    }
};

export default ConflictResolveSection;