import axios from 'axios';
import type { BookPageResponse, BookReponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const bookAPI = {
    searchAndSaveBooks: async (q: string, limit: number): Promise<BookReponse> => {
        const response = await axios.get(`${API_BASE_URL}/api/books/search`, { params: { q, limit } })
        console.log(response)
        return {
            success: true,
            books: response.data.books
        }
    },
    fetchBookPageAndLoadIfNeeded: async (workID: string): Promise<BookPageResponse> => {
        const response = await axios.get(`${API_BASE_URL}/api/books/${workID}`);
        console.log(response)
        return {
            success: true,
            openLibraryDetails: response.data.details,
            glossary_chapters: response.data.glossary.glossary_chapters,
            versionNum: response.data.glossary.glossary_details.version_number,
            version_history: response.data.version_history
        }
    },
}