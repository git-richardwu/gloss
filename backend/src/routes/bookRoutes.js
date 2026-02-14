const express = require('express');
const router = express.Router();

module.exports = (bookController) => {
    // router.get('/search', (req, res) => bookController.fetchBooksFromOpenLibrarySearch(req, res));
    //router.get('/:id', bookController.fetchBookPage.bind(bookController));
    router.get('/search', bookController.fetchBooksFromOpenLibrarySearch.bind(bookController));
    router.get('/:id', bookController.fetchBookPage.bind(bookController));
    return router
}