import React, { useEffect, useState } from "react";
import { bookAPI } from "../../services/bookAPI"
import { glossaryAPI } from "../../services/glossaryAPI"

import type { Book } from '../../types';
import SearchResults from "./SearchResults";
import { Link } from "react-router-dom";

interface Recents {
    work_id: string,
    title: string
}

const SearchBar = () => {
    const [query, setQuery] = useState<string>('');
    const [limit, setLimit] = useState<number>(1)
    const [results, setResults] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [recentChanges, setRecentChanges] = useState<Recents[]>([])

    useEffect(() => {
        const loadRecentlyUpdated = async () => {
            try {
                const response = await glossaryAPI.getRecentChanges();
                setRecentChanges(response.recents)
            } catch (err) {
                setError('Error searching books')
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        loadRecentlyUpdated();
    }, [])

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await bookAPI.searchAndSaveBooks(query, limit);
            if (response.success) {
                setResults(response.books)
            } else {
                setError('Failed to fetch results')
            }
        } catch (err) {
            setError('Error searching books')
            console.error(err)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className="brand">ARQS</h1>
            <h2>A Community Character Glossary</h2>
            <p>For when there's too many to track</p>

            <form onSubmit={handleSearch}>
                <input type='text'
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    placeholder="Search books..."
                    className="search-input"
                    autoFocus />
                <select onInput={(e: React.ChangeEvent<HTMLSelectElement>) => setLimit(parseInt(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                </select>
                <button type="submit" disabled={loading} className="search-button">
                    {loading ? 'Searching...' : 'Search'} </button>
            </form>
            <p>Recently edited books: {recentChanges.length > 0 ? (recentChanges.map(({ work_id, title }, index) => (
                <span key={work_id}>
                    {index > 0 && ', '}
                    <Link style={{color: "#446793"}} to={`/book/${work_id}`}>{title}</Link>
                </span>
            ))) : (<span>No recent changes</span>)}</p>
            <SearchResults books={results} />
            {/* {results.length === 0 && query && !loading && !error && (
                <p>No books found. Try a different search.</p>
            )} */}
        </div>
    )
}

export default SearchBar;