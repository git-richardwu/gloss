require('dotenv').config()
const db = require('./db/database');
//const initDB = require('./db/initializeDB');
const BookModel = require('./models/bookModel');
const GlossaryModel = require('./models/glossaryModel');
const BookService = require('./services/bookDBService');
const GlossaryService = require('./services/glossaryDBService');
const OpenLibraryService = require('./services/openLibraryService');
const BookController = require('./controllers/bookController');
const GlossaryController = require('./controllers/glossaryController');

const bookModel = new BookModel(db);
const glossaryModel = new GlossaryModel(db);
const openLibraryService = new OpenLibraryService();

const bookService = new BookService(bookModel, openLibraryService);
const glossaryService = new GlossaryService(glossaryModel)
const bookController = new BookController(bookService, glossaryService)

const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const http = require('http');
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/books', bookRoutes(bookController));

const testing = require('./services/test')

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})