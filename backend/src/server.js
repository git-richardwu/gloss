require('dotenv').config()
const db = require('./db/database');
const initialDB = require('./db/initializeDB');
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
const glossaryController = new GlossaryController(glossaryService)

const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const glossaryRoutes = require('./routes/glossaryRoutes')

const app = express();
const http = require('http');
const port = 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/books', bookRoutes(bookController));
app.use('/api/books', glossaryRoutes(glossaryController));

// const testing = require('./services/test')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function start() {
  await initialDB();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
}

start();