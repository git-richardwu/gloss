import axios from 'axios';
import type { BookReponse } from '../types';

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
    getBookDescriptionAndLoad: async (workID: string) => {
        const response = await axios.get(`${API_BASE_URL}/books/${workID}`);
        console.log(response)
        return {
            success: true,
            details: response.data.book
        }
    }
}