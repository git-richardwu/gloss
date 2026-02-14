require('dotenv').config()
const BookModel = require('../models/bookModel');
const GlossaryModel = require('../models/glossaryModel');
const BookService = require('../services/bookDBService');
const GlossaryService = require('../services/glossaryDBService');
const OpenLibraryService = require('../services/openLibraryService');
const BookController = require('../controllers/bookController');
const db = require('../database')

describe('Book Model Integration', () => {
    let bookModel, glossaryModel, openLibraryService, database;
    let bookService, glossaryService, bookController;

    beforeEach(() => {
        bookModel = new BookModel(db);
        glossaryModel = new GlossaryModel(db);
        openLibraryService = new OpenLibraryService();

        bookService = new BookService(bookModel, openLibraryService);
        glossaryService = new GlossaryService(glossaryModel)
        bookController = new BookController(bookService, glossaryService)
    })

    test('it should not create duplicates', async () => {
        const res = await bookController.searchBooksTest("memoirs of sherlock", 1)
    })
})