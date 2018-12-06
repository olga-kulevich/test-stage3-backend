'use strict';

const express = require('express');

const controller = require('../controllers/books');

const router = express.Router();

router.get('/:id', controller.getBookById);

router.get('/', controller.getBooks);

router.put('/:id', controller.validate('updateBook'), controller.updateBook);

router.patch('/:id', controller.validate('patchBook'), controller.patchBook);

router.post('/', controller.validate('createBook'), controller.createBook);

router.delete('/:id', controller.removeBook);

module.exports = router;