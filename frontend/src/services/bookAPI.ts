import axios from 'axios';
import type { BookPageResponse, BookReponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const bookAPI = {
    searchAndSaveBooks: async (q: string, limit: number): Promise<BookReponse> => {
        const response = await axios.get(`${API_BASE_URL}/books/search`, { params: { q, limit } })
        console.log(response)
        return {
            success: true,
            books: response.data.books
        }
    },
    fetchBookPageAndLoadIfNeeded: async (workID: string): Promise<BookPageResponse> => {
        const response = await axios.get(`${API_BASE_URL}/books/${workID}`);
        console.log(response)
        return {
            success: true,
            openLibraryDetails: response.data.details,
            glossary_chapters: response.data.glossary.glossary_chapters,
            versionNum: response.data.glossary.glossary_details.version_number
        }
    },
}