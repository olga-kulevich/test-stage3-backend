'use strict';
const Author = require('../dao/author');
const mongoose = require('mongoose');
const controller = {};

/**
 * Send specific author entity by id
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getAuthorById = function (req, res) {
    Author.findById({_id: req.params.id})
        .then(function(author) {
            if (author) {
                res.status(200).send({author: author});
            } else {
                res.status(404).send({errors: ["Author not exist"]});
            }
        })
        .catch(function(error){
            res.status(404).send({error});
        });
};
/**
 * Send author collection
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getAuthors = function (req, res) {
    Author.find({})
        .then(function(allAuthors) {
            let authors = [];

            allAuthors.forEach(function(author) {
                authors.push(author);
            });

            res.status(200).send({authors: authors});
        })
        .catch(function(err) {
            console.error(err);
        });
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
 * Create author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.createAuthor = function (req, res) {
    let id = req.body._id;

    if (!id) {
       id = new mongoose.Types.ObjectId();
    }

    const author = new Author({
        _id: id,
        email: req.body.email,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        book: req.body.book,
        birthDate: req.body.birthDate
    });

    author.save()
        .then(function(){
            res.status(201).send({author});
        })
        .catch(function(err){
            console.error(err);
        });
};

/**
 * Delete author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.removeAuthor= function (req, res) {
    Author.findByIdAndRemove({_id: req.params.id})
        .then(function() {
            res.status(200).send({status: 'OK'});
        })
        .catch(function(error) {
            res.status(404).send({error});
        });
};

module.exports = controller;