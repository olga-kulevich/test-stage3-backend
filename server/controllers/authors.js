'use strict';
let controller = {};
/**
 * Send specific author entity by id
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getAuthorById = function (req, res) {
    //TODO implement
    res.send('');
}
/**
 * Send author collection
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getAuthors = function (req, res) {
    res.send('');
}

/**
 * Update author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.updateAuthor= function (req, res) {
    res.send('');
}

/**
 * Patch author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.patchAuthor= function (req, res) {
    res.send('');
}

/**
 * Delete author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.removeAuthor= function (req, res) {
    res.send('');
}

module.exports = controller;