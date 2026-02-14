const axios = require('axios');
const { ExternalServiceError } = require('../errors/AppError')

class OpenLibraryService {
    constructor() {
        this.baseURL = "https://openlibrary.org/";
        this.coversURL = "https://covers.openlibrary.org/b";
    }
    formatResponse(results) {
        return results.map(book => ({
            work_id: book.key?.replace('/works/', '') || '', //workID
            title: book.title || 'Title Unavailable',
            author: Object.values(book.author_name).join(', ').replace(/[{}""]/g, '') || 'Author Unknown',
            // coverURL: book.cover_i ? `${this.coversURL}/id/${book.cover_i}-M.jpg` : '',
            cover_url: book.cover_i ? `${this.coversURL}/id/${book.cover_i}-` : '',
            year_published: book.first_publish_year || -1,
        }));
    }
    async searchBooks(query, limit=10) { //http://localhost:3000/api/books/search?q=Skeleton+Crew
        //https://openlibrary.org/search.json?q=the+lord+of+the+rings
        //https://openlibrary.org/works/OL45804W.json
        try {
            const response = await axios.get(`${this.baseURL}/search.json`, {
                params: {
                    q: query,
                    limit: limit, 
                    fields: 'key, title, author_name, cover_i, first_publish_year',
                    type: 'work'
                }
            });
            return this.formatResponse(response.data.docs);
        } catch (error) {
            console.error('OpenLibrary API error:', error.message)
            throw new ExternalServiceError()
        }
    }

    async getBookDesc(workID) { //http://localhost:3000/api/books/OL81627W
        try {
            const response = await axios.get(`${this.baseURL}/works/${workID}.json`);
            const book = response.data;
            return {
                work_id: workID,
                descript: book.description?.value || book.description || 'No description provided',
            };
        }
        catch (error) {
            console.error('Error getting book details:', error.message)
            throw new ExternalServiceError()
        }
    }
}

module.exports = OpenLibraryService;