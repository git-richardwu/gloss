import React, { useState } from "react";
import { bookAPI } from "../../services/bookAPI"
import type { Book } from '../../types';
import SearchResults from "./SearchResults";

const SearchBar = () => {
    const [query, setQuery] = useState<string>('');
    const [limit, setLimit] = useState<number>(1)
    const [results, setResults] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            console.log(query)
            const response = await bookAPI.searchAndSaveBooks(query, limit);
            console.log(response)
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
            <SearchResults books={results} />
            {/* {results.length === 0 && query && !loading && !error && (
                <p>No books found. Try a different search.</p>
            )} */}
        </div>
    )
}

export default SearchBar;