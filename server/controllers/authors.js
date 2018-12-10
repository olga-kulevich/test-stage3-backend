'use strict';

const Author = require('../dao/author');
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
        case 'updateAuthor':
            return [
                body('email', 'E-mail is require').exists({checkFalsy: true})
            ];
        case 'createAuthor':
            return [
                body('email', 'E-mail is require').exists({checkFalsy: true})
            ];
        case 'patchAuthor':
            return [
                body ('email', 'E-mail is require')
                    .exists({checkFalsy: true})
                    .optional()
            ];
    }
};

/**
 * Send specific author entity by id
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getAuthorById = (req, res) => {
    Author.findById({_id: req.params.id})
        .then((author) => {
            if (author) {
                res.status(200).send({author: author});
            } else {
                res.status(404).send({errors: ["Author not exist"]});
            }
        })
        .catch((error) => {
            res.status(404).send({error});
        });
};

/**
 * Send author collection
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getAuthors = (req, res) => {
    Author.find({})
        .then((allAuthors) => {
            let authors = [];

            allAuthors.forEach((author) => {
                authors.push(author);
            });

            res.status(200).send({authors: authors});
        })
        .catch((err) => {
            console.error(err);
        });
};

/**
 * Update author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.updateAuthor = (req, res) => {
    const id = req.params.id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Author.findById({_id: id}, (err, existingAuthor) => {
            if (existingAuthor && (!req.body._id || existingAuthor._id === req.body._id)) {
                Author.findOneAndUpdate(
                    {_id: id},
                    {
                        $set: {
                            email: req.body.email,
                            firstName: req.body.firstName,
                            secondName: req.body.secondName,
                            book: req.body.book,
                            birthDate: req.body.birthDate
                        }
                    },
                    {new: true, runValidators: true}
                )
                    .then((author) => {
                        res.status(200).send({author});
                    })

                    .catch((err) => {
                        console.error(err);
                    })
            } else if (!existingAuthor) {
                res.status(404).send({errors: ["Author not exist"]});
            } else if (existingAuthor._id !== req.body._id){
                Author.findById({_id: req.body._id})
                    .then((findAuthor) => {
                        if (findAuthor) {
                            res
                                .status(400)
                                .send({errors: ["Author with this id already exist"]});
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
 * Patch author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.patchAuthor = (req, res) => {
    const id = req.params.id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Author.findById({_id: id}, (err, existingAuthor) => {
            if (existingAuthor && (!req.body._id || existingAuthor._id === req.body._id)) {
                if (req.body._id) {
                    delete req.body._id;
                }
                for (let pr in req.body) {
                    existingAuthor[pr] = req.body[pr];
                }
                existingAuthor.save()
                    .then((author) => {
                        res.status(200).send({author});
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            } else if (!existingAuthor) {
                res.status(404).send({errors: ["Author not exist"]});
            } else if (req.body._id) {
                Author.findById({_id: req.body._id})
                    .then((findAuthor) => {
                        if (findAuthor) {
                            res
                                .status(400)
                                .send({errors: ["Author with this id already exist"]});
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }
        });
    }
};

/**
 * Create author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.createAuthor = (req, res) => {
    const id = req.body._id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Author.findById({_id: id}, (err, existedAuthor) => {
            if (!existedAuthor) {
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
                    .then(() => {
                        res.status(201).send({author});
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                res
                    .status(400)
                    .send({errors: ["Author with this id already exist"]});
            }
        });
    }
};

/**
 * Delete author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.removeAuthor = (req, res) => {
    Author.findByIdAndRemove({_id: req.params.id})
        .then((item) => {
            if (!item) {
                res.status(404).send({errors: ["Author not exist"]});
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