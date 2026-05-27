import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { bookAPI } from "../services/bookAPI"
import type { BookDetails, Chapter, ConflictingData, Character, ConflictAnalysis } from '../types'
import styles from './BookPage.module.css'
import GlossarySection from "../components/Glossary/GlossarySection";
import ConflictResolveSection from "../components/Glossary/ConflictResolve";
import { glossaryAPI } from "../services/glossaryAPI";
// import { findChapterConflicts } from "../services/findChapterConflicts";
import axios, {AxiosError} from "axios";

interface ConflictState {
    conflicts: ConflictAnalysis;
    currentGlossary: Chapter[];
    ourGlossary: Chapter[];
    databaseVersion: number;
}

type GlossaryUpdateError = AxiosError<ConflictState>;

const BookPage = () => {
    const empty_glossary: Chapter[] = [];
    const [loading, setLoading] = useState<boolean>(true);
    const [book, setBook] = useState<BookDetails | null>(null);
    const [glossary, setGlossary] = useState<Chapter[]>(empty_glossary);
    const [glossaryVersion, setGlossaryVersion] = useState<number>(1);
    const { work_id } = useParams<{ work_id: string }>();
    const [error, setError] = useState<string | null>(null);
    const [conflictStatus, setConflictStatus] = useState<boolean>(false);
    const [conflictState, setConflictState] = useState<ConflictState | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    // const [updateTime, setUpdateTime] = useState<string | null>(null);

    useEffect(() => {
        if (!work_id) {
            setError("No book id provided")
            setLoading(false)
            return
        }
        const fetchBookDetails = async () => {
            try {
                setLoading(true)
                const response = await bookAPI.fetchBookPageAndLoadIfNeeded(work_id);
                if (response.success) {
                    setBook(response.openLibraryDetails)
                    if (response.glossary_chapters === null) {
                        setGlossary([])
                    } else {
                        setGlossary(response.glossary_chapters)
                    }
                    setGlossaryVersion(response.versionNum)
                    // setUpdateTime(response.glossary.updated_at)
                } else {
                    setError('Failed to get book detail')
                }
            } catch (err) {
                setError('Error fetching book')
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        if (work_id) {
            fetchBookDetails();
        }
    }, [work_id])

    useEffect(() => {
        console.log('📝 Glossary state updated:', {
            chapters: glossary.length,
            totalCharacters: glossary.reduce(
                (sum, ch) => sum + ch.characters.length, 0
            )
        });
    }, [glossary]);

    const handleConflictResolve = async (resolutions: Chapter[]) => {
        if (!work_id || !conflictState) return
        try {
            const response = await glossaryAPI.updateCommunityGlossary(resolutions, work_id, conflictState.databaseVersion);
            setGlossary(response.glossary_chapters);
            setGlossaryVersion(response.version);
            setIsDirty(false);
            setConflictStatus(false);
        } catch (error) {
            console.error('Failed to resolve conflicts:', error);
        }
    }


    const chapterOps = {
        updateName: (chapterID: string, newName: string) => {
            setGlossary(prev => prev.map(ch =>
                ch.chapter_id === chapterID
                    ? { ...ch, chapter_name: newName }
                    : ch
            )
            );
            setIsDirty(true);
        },
        updatePosition: (chapterID: string, newPosition: number) => {
            setGlossary(prev => prev.map(ch =>
                ch.chapter_id === chapterID
                    ? { ...ch, position: newPosition }
                    : ch
            ));
            setIsDirty(true);

        },
        addChapter: (newChapter: Chapter) => {
            setGlossary(prev => [
                ...prev,
                {
                    chapter_id: newChapter.chapter_id,
                    work_id: newChapter.work_id,
                    chapter_name: newChapter.chapter_name,
                    // position: prev.length,
                    position: newChapter.position,
                    characters: newChapter.characters
                }
            ]);

            setIsDirty(true);
        },
        deleteChapter: (chapterID: string) => {
            console.log(glossary)
            setGlossary(prev => {
                const updated = prev.filter(
                    ch => ch.chapter_id !== chapterID
                )
                console.log('Updated glossary:', updated);
                return updated;
            });
            setIsDirty(true);
        },
    }

    const characterOps = {
        addCharacter: (chapterID: string, characterData: Character) => {
            setGlossary(prev =>
                prev.map(ch =>
                    ch.chapter_id === chapterID
                        ? {
                            ...ch,
                            characters: [
                                ...ch.characters,
                                {
                                    character_id: characterData.character_id,
                                    chapter_id: chapterID,
                                    work_id: characterData.work_id,
                                    character_name: characterData.character_name,
                                    character_description:
                                        characterData.character_description,
                                    central_character:
                                        characterData.central_character || false
                                }
                            ]
                        }
                        : ch
                )
            );
            setIsDirty(true);
        },
        updateCharacter: (characterID: string, newCharacterData: Partial<Character>) => {
            setGlossary(prev =>
                prev.map(ch => ({
                    ...ch,
                    characters: ch.characters.map(c => c.character_id === characterID ? { ...c, ...newCharacterData } : c)
                }))
            );
            setIsDirty(true);
        },
        deleteCharacter: (characterID: string) => {
            setGlossary(prev => prev.map(ch => ({
                ...ch, characters: ch.characters.filter(c => c.character_id !== characterID)
            }))
            );
            setIsDirty(true);
        }
    }

    const handleSaveAll = async () => {
        if (!work_id || !glossary) {
            setError('No book id or glossary provided');
            return;
        }
        try {
            console.log('Updating...');
            const response = await glossaryAPI.updateCommunityGlossary(glossary, work_id, glossaryVersion);
            console.log('Full response:', response);
            console.log('Response glossary:', response.glossary_chapters);
            console.log('Response data:', response.version);
            console.log('Update success!');
            setGlossary(response.glossary_chapters);
            setGlossaryVersion(response.version);
            setIsDirty(false);

        } catch (err) {
            console.log(err)
            const error = err as GlossaryUpdateError;
            if (error.response?.status === 409) {
                // const { currentGlossary, databaseVersion }: { currentGlossary: GlossaryData, databaseVersion: number } = err.response.data
                console.log("REACHED HERE AT 205")
                console.log(error.response.data)
                const { conflicts, currentGlossary, ourGlossary, databaseVersion }: ConflictState = error.response.data;
                if (error.response?.status === 409) {
                    if (JSON.stringify(currentGlossary) === JSON.stringify(glossary)) {
                        console.log('No actual conflict, updating version');
                        setGlossaryVersion(databaseVersion)
                        return;
                    }
                    // Real conflict
                    setConflictState({
                        conflicts,
                        currentGlossary,
                        ourGlossary,
                        databaseVersion
                    });
                    setConflictStatus(true);
                }
            } else {
                console.error('Error saving:', err);
            }
        }
    }

    if (loading) {
        return (
            <div>Loading book details</div>
        )
    }
    if (!glossary) {
        console.log(glossary)
        return (
            <div>Error loading glossary.</div>
        )
    }

    if (!work_id) return <div>No work ID found</div>; //delete later

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error}</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <h1>{book?.title}</h1>
                <h3>{book?.author}</h3>
                <h3>{book?.year_published}</h3>
                <img className={styles.image} src={`${book?.cover_url}M.jpg`} />
                <p className={styles.description}>{book?.descript}</p>
            </div>
            <div className={styles.right}>
                <h1>Ver. {glossaryVersion}</h1>
                {conflictStatus && conflictState ? <ConflictResolveSection conflicts={conflictState.conflicts}
                    ourGlossary={conflictState.ourGlossary}
                    theirGlossary={conflictState.currentGlossary}
                    databaseVersion={conflictState.databaseVersion}
                    onResolve={handleConflictResolve}
                    onCancel={() => setConflictStatus(false)} /> :
                    <GlossarySection glossary={glossary} work_id={work_id} onSaveAll={handleSaveAll} chapterOps={chapterOps} characterOps={characterOps} isDirty={isDirty} />}
                {/* <GlossarySection glossary={glossary} work_id={work_id} onGlossaryChange={setGlossary} onSaveChapter={handleSaveChapter} onDeleteChapter={handleDeleteChapter}/>} */}
            </div>
        </div>
    )
}

export default BookPage;
