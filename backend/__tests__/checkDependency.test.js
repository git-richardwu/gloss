require('dotenv').config()
const BookModel = require('../models/bookModel');
const GlossaryModel = require('../models/glossaryModel');
const BookService = require('../services/bookDBService');
const GlossaryService = require('../services/glossaryDBService');
const OpenLibraryService = require('../services/openLibraryService');
const BookController = require('../controllers/bookController');
const db = require('../database')

describe('Dependency Injection Integration', () => {
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

    test('BookService should have access to bookModel methods', () => {
        // Verify the bookModel instance has the expected method
        expect(typeof bookModel.findBookByWorkID).toBe('function');

        // Verify bookService can access it through its dependency
        expect(bookService.bookModel).toBe(bookModel);
        expect(typeof bookService.bookModel.findBookByWorkID).toBe('function');
    });
    test('BookController should have properly wired services', () => {
        expect(bookController.bookService).toBe(bookService);
        expect(bookController.glossaryService).toBe(glossaryService);
    });

    // afterEach(async () => {
    //     // If your models have access to the pool, close all connections
    //     // If models share the same pool, you might need to access it differently
    //     // This depends on how you set up your models
    // });

    afterAll(async () => {
        // Additional cleanup if needed
        await db.pool.end();
    });
})

