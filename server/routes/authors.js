'use strict';

const express = require('express');
const controller = require('../controllers/authors');

const router = express.Router();

// TODO Add other author routes
router.get('/:id', controller.getAuthorById);

router.get('/', controller.getAuthors);

module.exports = router;