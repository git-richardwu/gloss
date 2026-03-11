const express = require('express');
const router = express.Router({mergeParams: true});

module.exports = (glossaryController) => {
    router.put('/:id/glossary', glossaryController.updateGlossary.bind(glossaryController));
    return router
}