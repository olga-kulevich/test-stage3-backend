'use strict';

const Book = require('../dao/book');
const mongoose = require('mongoose');
const errorFormatter = require('./validate/error_formatter');
const {body, validationResult} = require('express-validator/check');

const controller = {};

/**
 * Provide list of validation rules
 * @param {String} method - the name of controller method
 * @returns {Array} list of validation rules
 */
controller.validate = (method) => {
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
 * Send specific book entity by id
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getBookById = (req, res) => {
    Book.findById({_id: req.params.id})
        .then((book) => {
            if (book) {
                res.status(200).send({book: book});
            } else {
                res.status(404).send({errors: ["Book not exist"]});
            }
        })
        .catch((error) => {
            res.status(404).send({error});
        });
};

/**
 * Send book collection
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getBooks = (req, res) => {
    Book.find({})
        .then((allBooks) => {
            let books = [];

            allBooks.forEach(function(book) {
                books.push(book);
            });

            res.status(200).send({books: books});
        })
        .catch((err) => {
            console.error(err);
        });
};

/**
 * Update book
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.updateBook = (req, res) => {
    const id = req.params.id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Book.findById({_id: id}, (err, existingBook) => {
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
                    .then((book) => {
                        res.status(200).send({book});
                    })

                    .catch((err) => {
                        console.error(err);
                    })
            } else if (!existingBook) {
                res.status(404).send({errors: ["Book not exist"]});
            } else if (existingBook._id !== req.body._id){
                Book.findById({_id: req.body._id})
                    .then((findBook) => {
                        if (findBook) {
                            res
                                .status(400)
                                .send({errors: ["Book with this id already exist"]});
                        }
                    })
                    .catch ((err) => {
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
controller.patchBook = (req, res) => {
    const id = req.params.id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Book.findById({_id: id}, (err, existingBook) => {
            if (existingBook && (!req.body._id || existingBook._id === req.body._id)) {
                if (req.body._id) {
                    delete req.body._id;
                }
                for (let pr in req.body) {
                    existingBook[pr] = req.body[pr];
                }
                existingBook.save()
                    .then((book) => {
                        res.status(200).send({book});
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            } else if (!existingBook) {
                res.status(404).send({errors: ["Book not exist"]});
            } else if (req.body._id) {
                Book.findById({_id: req.body._id})
                    .then((findBook) => {
                        if (findBook) {
                            res
                                .status(400)
                                .send({errors: ["Book with this id already exist"]});
                        }
                    })
                    .catch((err) =>{
                        console.error(err)
                    })
            }
        });
    }
};

/**
 * Create book
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.createBook = (req, res) => {
    const id = req.body._id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
       Book.findById({_id: id}, (err, existedBook) => {
            if (!existedBook) {
                if (!id) {
                    id = new mongoose.Types.ObjectId();
                }

                const book = new Book({
                    _id: id,
                    name: req.body.name,
                    publishing: req.body.publishing,
                    ebook: req.body.ebook,
                    isbn: req.body.isbn,
                    author: req.body.author,
                    pages: req.body.pages,
                    year: req.body.year
                });

                book.save()
                    .then((book) => {
                        res.status(201).send({book});
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                res
                    .status(400)
                    .send({errors: ["Book with this id already exist"]});
            }
        });
    }
};

/**
 * Delete book
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.removeBook = (req, res) => {
    Book.findByIdAndRemove({_id: req.params.id})
        .then((item) => {
            if (!item) {
                res.status(404).send({errors: ["Book not exist"]});
            }
            if (item) {
                res.status(200).send({status: 'OK'});
            }
        })
        .catch((err) => {
            console.error(err);
        });
};

module.exports = controller;