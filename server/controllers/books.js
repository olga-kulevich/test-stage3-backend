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
controller.getBookById = function (req, res) {
    Book.findById({_id: req.params.id})
        .then(function(book) {
            if (book) {
                res.status(200).send({book: book});
            } else {
                res.status(404).send({errors: ["Book not exist"]});
            }
        })
        .catch(function(error){
            res.status(404).send({error});
        });
};

/**
 * Send book collection
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getBooks = function (req, res) {
    Book.find({})
        .then(function(allBooks) {
            let books = [];

            allBooks.forEach(function(book) {
                books.push(book);
            });

            res.status(200).send({books: books});
        })
        .catch(function(err) {
            console.error(err);
        });
};

/**
 * Update book
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.updateBook = function (req, res) {
    let id = req.params.id;
    let resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Book.findById({_id: id}, function (err, existingBook) {
            if (existingBook && (!req.body._id || existingBook._id === req.body._id)) {
                Book.findOneAndUpdate(
                    {_id: id},
                    {
                        $set: {
                            name: req.body.name,
                            publishing: req.body.publishing,
                            ebook: req.body.ebook,
                            isbn: req.body.isbn,
                            author: req.body.author,
                            pages: req.body.pages,
                            year: req.body.year
                        }
                    },
                    {new: true, runValidators: true}
                )
                    .then(function(book) {
                        res.status(200).send({book});
                    })

                    .catch(function(err) {
                        console.error(err);
                    })
            } else if (!existingBook) {
                res.status(404).send({errors: ["Book not exist"]});
            } else if (existingBook._id !== req.body._id){
                Book.findById({_id: req.body._id})
                    .then(function(findBook) {
                        if (findBook) {
                            res
                                .status(400)
                                .send({errors: ["Book with this id already exist"]});
                        }
                    })
                    .catch (function(err) {
                        console.error(err)
                    })
            }
        });
    }
};

/**
 * Patch book
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.patchBook = function (req, res) {
    let id = req.params.id;
    let resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Book.findById({_id: id}, function (err, existingBook) {
            if (existingBook && (!req.body._id || existingBook._id === req.body._id)) {
                if (req.body._id) {
                    delete req.body._id;
                }
                for (let pr in req.body) {
                    existingBook[pr] = req.body[pr];
                }
                existingBook.save()
                    .then(function(book) {
                        res.status(200).send({book});
                    })
                    .catch(function(err) {
                        console.error(err);
                    })
            } else if (!existingBook) {
                res.status(404).send({errors: ["Book not exist"]});
            } else if (req.body._id) {
                Book.findById({_id: req.body._id})
                    .then(function(findBook) {
                        if (findBook) {
                            res
                                .status(400)
                                .send({errors: ["Book with this id already exist"]});
                        }
                    })
                    .catch(function(err) {
                        console.error(err)
                    })
            }
        });
    }
};

//TODO add other methods

module.exports = controller;