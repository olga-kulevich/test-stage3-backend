'use strict';

const express = require('express');
const controller = require('../controllers/adverts');

const router = express.Router();

router.get('/:id', controller.getAdvertById);

router.get('/', controller.getAdverts);

router.put('/:id', controller.validate('updateAdvert'), controller.updateAdvert);

router.patch('/:id', controller.validate('patchAdvert'), controller.patchAdvert);

router.post('/', controller.validate('createAdvert'), controller.createAdvert);

router.delete('/:id', controller.removeAdvert);

module.exports = router;