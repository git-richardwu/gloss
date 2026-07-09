const express = require('express');
const router = express.Router({mergeParams: true});

module.exports = (glossaryController) => {
    router.put('/:id/glossary', glossaryController.updateGlossary.bind(glossaryController));
    router.post('/:id/glossary/resolve-conflicts', glossaryController.resolveConflicts.bind(glossaryController));
    router.get('/:id/glossary/version/:version', glossaryController.fetchVersion.bind(glossaryController));
    return router
}