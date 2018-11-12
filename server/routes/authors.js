'use strict';

const express = require('express');
const controller = require('../controllers/authors');

const router = express.Router();

// TODO Add other author routes
router.get('/:id', controller.getAuthorById);

router.get('/', controller.getAuthors);

router.put('/:id', controller.updateAuthor);

router.patch('/:id', controller.patchAuthor);

router.post('/', controller.createAuthor);

router.delete('/:id', controller.removeAuthor);

module.exports = router;