const express = require('express');
const router = express.Router({mergeParams: true});

module.exports = (bookController) => {
    router.get('/search', bookController.fetchBooksFromOpenLibrarySearch.bind(bookController));
    router.get('/:id', bookController.fetchBookPage.bind(bookController));
    return router
}