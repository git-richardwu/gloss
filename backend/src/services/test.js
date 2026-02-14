const db = require('../db/database')
const OpenLibraryService = require('./openLibraryService');
const BookModel = require('../models/bookModel');
const BookDBService = require('./bookDBService');
const GlossaryDBService = require('./glossaryDBService');
const GlossaryModel = require('../models/glossaryModel')
const BookController = require('../controllers/bookController')

const openLibraryService = new OpenLibraryService()
const bookModel = new BookModel(db)
const glossModel = new GlossaryModel(db)
const bookService = new BookDBService(bookModel, openLibraryService)

const glossaryDBService = new GlossaryDBService(glossModel)

async function bookModelTests() {
    console.log('Running findBookByName Test 🏮');
    const next = await bookService.searchOpenLibraryAndSave('Zombies Vs. Unicorns', 1)
    // const finding = await bookService.loadOpenLibraryDescriptionAndSave("OL22427505W")
    // const finding = await openLibraryService.getBookDesc("OL22427505W")
    // const dark = await bookService.updateBookDescription(finding)

    const finding = await bookService.loadOpenLibraryDescriptionAndSave('OL257943W')
    //console.log('Running getAllBooks Test 🏮');
    //const getAll = await BookModel.getAllBooks();
    // console.log(finding.books[0].author)
    // console.log(typeof finding.books[0].author)
    console.log(next)
    console.log(finding.book)
    // console.log(dark)
}

async function glossaryModelTests() {
    console.log('Running fetchCommunityGlossaryByID Test 🏮');
    
    // console.log('Running addCommunityGlossary Test 🏮');
    const addingEmpty = await glossaryDBService.getGlossaryByWorkID("OL22427505W")
    // console.log('Running updateCommunityGlossary Test 🏮');
    // const fetchCommunity = await glossaryDBService.updateCommunityGlossary({
    //     "Chapter 1" : [],
    //     "Chapter 2" : [],
    //     "Chapter 3" : [],
    // },"OL22427505W")
    //const fetchCommunity = await glossaryDBService.createEmptyCommunityGlossary("OL22427505W")
    // console.log(updatingGloss)
    console.log(addingEmpty)

    // console.log(updat
    // ingGloss)
}

// async function bookControllerTest() {
//     const theopenLibraryService = new openLibraryService();
//     const thebookModel = new BookModel(db);
//     const bookService = new BookDBService(thebookModel, theopenLibraryService);
//     const bookController = new BookController(bookService);
//     console.log('Running bookController Test 🏮');
//     const fetchCommunity = await bookController.searchBooks("sherlock", 2)
//     console.log(fetchCommunity)
// }

bookModelTests();
// glossaryModelTests();
// bookControllerTest();