import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { bookAPI } from "../services/bookAPI"
import type { BookDetails, Chapter, GlossaryData } from '../types'
import styles from './BookPage.module.css'
import GlossarySection from "../components/Glossary/GlossarySection";
import { glossaryAPI } from "../services/glossaryAPI";


const BookPage = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [book, setBook] = useState<BookDetails | null>(null)
    const [glossary, setGlossary] = useState<GlossaryData | null>(null)
    const { work_id } = useParams<{ work_id: string }>();
    const [error, setError] = useState<string | null>(null);
    // const [updateTime, setUpdateTime] = useState<string | null>(null);

    useEffect(() => {
        if (!work_id) {
            setError("No book id provided")
            setLoading(false)
            return
        }
        const fetchBookDetails = async () => {
            try {
                const response = await bookAPI.fetchBookPageAndLoadIfNeeded(work_id);
                if (response.success) {
                    setBook(response.details)
                    setGlossary(response.glossary.glossary_content)

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
        fetchBookDetails();
        // setLoading(true)

    }, [work_id])

    const handleSaveUpdateToDatabase = async (index: number, updatedChapter: Chapter) => {
        if (!work_id || !glossary) {
            setError('No book id or glossary provided')
            return;
        }
        const updatedChapters = [...glossary.chapters];
        updatedChapters[index] = updatedChapter;
        const updatedGlossary = {
            ...glossary,
            chapters: updatedChapters
        }

        setGlossary(updatedGlossary)
        console.log('Sending to API:', {
            work_id,
            glossary
        });
        try {
            console.log('Updating...')
            const response = await glossaryAPI.updateCommunityGlossary(updatedGlossary, work_id)
            if (response.success) {
                console.log('Update success!')
            }
        } catch (err) {
            //Revert
            setError('Error updating book')
            console.log(err)
        }
    }

    if (loading) {
        return (
            <div>Loading book details</div>
        )
    }
    if (!glossary) {
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
                <GlossarySection glossary={glossary} work_id={work_id} onGlossaryChange={setGlossary} onUpdateGlossaryDB={handleSaveUpdateToDatabase} />
            </div>
        </div>
    )
}

export default BookPage;
