import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { bookAPI } from "../services/bookAPI"
import type { BookDetails, Chapter, GlossaryData } from '../types'
import styles from './BookPage.module.css'
import GlossarySection from "../components/Glossary/GlossarySection";
import { glossaryAPI } from "../services/glossaryAPI";
import axios from "axios";


const BookPage = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [book, setBook] = useState<BookDetails | null>(null)
    const [glossary, setGlossary] = useState<GlossaryData | null>(null)
    const [glossaryVersion, setGlossaryVersion] = useState<number>(1)
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
                    setGlossaryVersion(response.glossary.version_number)
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
        console.log('Sending to API:', { work_id, glossary });
        try {
            console.log('Updating...')
            const response = await glossaryAPI.updateCommunityGlossary(updatedGlossary, work_id, glossaryVersion)
            console.log('Update success!')
            setGlossaryVersion(response.version)
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    console.log(err.response?.data)
                }
            } else {
                setError('Error updating book')
                console.log(err)
            }
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
                <h1>Ver. {glossaryVersion}</h1>
                <GlossarySection glossary={glossary} work_id={work_id} onGlossaryChange={setGlossary} onUpdateGlossaryDB={handleSaveUpdateToDatabase} />
            </div>
        </div>
    )
}

export default BookPage;
