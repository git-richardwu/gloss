import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { bookAPI } from "../services/bookAPI"
import type { BookDetails, GlossaryData } from '../types'
import styles from './BookPage.module.css'
import GlossarySection from "../components/Glossary/GlossarySection";


const BookPage = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [book, setBook] = useState<BookDetails | null>(null)
    const [glossary, setGlossary] = useState<GlossaryData | null>(null)
    const { work_id } = useParams<{ work_id: string }>();
    const [error, setError] = useState<string | null>(null);
    const [updateTime, setUpdateTime] = useState<string | null>(null);


    useEffect(() => {
        if (!work_id) {
            setError("No book id provided")
            setLoading(false)
            return
        }
        const fetchBookDetails = async (): Promise<void> => {
            try {
                const response = await bookAPI.fetchBookPageAndLoadIfNeeded(work_id);
                if (response.success) {
                    setBook(response.details)
                    setGlossary(response.glossary.glossary_content)
                    setUpdateTime(response.glossary.updated_at)
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
    }, [work_id])

    if (loading) {
        return (
            <div>Loading book details</div>
        )
    }

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
                <img className={styles.image} src={`${book?.cover_url}` + 'M.jpg'} />
                <p className={styles.description}>{book?.descript}</p>
            </div>
            <div className={styles.right}>
                <h1>Community Glossary</h1>
                <p>{updateTime}</p>
                <GlossarySection glossary={glossary} work_id={work_id!} />
            </div>
        </div>
    )
}

export default BookPage;
