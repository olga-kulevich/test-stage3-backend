'use strict';
const Book = require('../dao/book');
const mongoose = require('mongoose');
const {body, validationResult} = require('express-validator/check');

const controller = {};

/**
 * Provide list of validation rules
 * @param {String} method - the name of controller method
 * @returns {Array} list of validation rules
 */
controller.validate = function (method) {
    switch (method) {
        case 'updateBook':
            return [
                body('name', 'Name is require').exists({checkFalsy: true})
            ];
        case 'createBook':
            return [
                body('name', 'Name is require').exists({checkFalsy: true})
            ];
        case 'patchBook':
            return [
                body ('name', 'Name is require')
                    .exists({checkFalsy: true})
                    .optional()
            ];
    }
};

/**
 * Format validation result (error)
 * @param {{msg: String}} error - error argument
 * @returns {String} error text message
 */
function errorFormatter({msg}) {
    return `${msg}`;
}

/** 
 * Send specific book entity by id
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
function getBookById(req, res) {
    //TODO implement
    res.send('');
}

//TODO add other methods

