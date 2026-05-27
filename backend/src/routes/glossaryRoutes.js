const express = require('express');
const router = express.Router({mergeParams: true});

module.exports = (glossaryController) => {
    router.put('/:id/glossary', glossaryController.updateGlossary.bind(glossaryController));
    router.post('/:id/glossary/resolve-conflicts', glossaryController.resolveConflicts.bind(glossaryController));
    return router
}