'use strict';
const Author = require('../dao/author');
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
 * Format validation result (error)
 * @param {{msg: String}} error - error argument
 * @returns {String} error text message
 */
function errorFormatter({msg}) {
    return `${msg}`;
}

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
controller.updateAuthor = function (req, res) {
    let id = req.params.id;
    let resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Author.findById({_id: id}, function (err, existingAuthor) {
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
                    .then(function(author) {
                        res.status(200).send({author});
                    })

                    .catch(function(err) {
                        console.error(err);
                    })
            } else if (!existingAuthor) {
                res.status(404).send({errors: ["Author not exist"]});
            } else if (existingAuthor._id !== req.body._id){
                Author.findById({_id: req.body._id})
                    .then(function(findAuthor) {
                        if (findAuthor) {
                            res
                                .status(400)
                                .send({errors: ["Author with this id already exist"]});
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
 * Patch author
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.patchAuthor = function (req, res) {
    let id = req.params.id;
    let resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Author.findById({_id: id}, function (err, existingAuthor) {
            if (existingAuthor && (!req.body._id || existingAuthor._id === req.body._id)) {
                if (req.body._id) {
                    delete req.body._id;
                }
                for (let pr in req.body) {
                    existingAuthor[pr] = req.body[pr];
                }
                existingAuthor.save()
                    .then(function(author) {
                        res.status(200).send({author});
                    })
                    .catch(function(err) {
                        console.error(err);
                    })
            } else if (!existingAuthor) {
                res.status(404).send({errors: ["Author not exist"]});
            } else if (req.body._id) {
                Author.findById({_id: req.body._id})
                    .then(function(findAuthor) {
                        if (findAuthor) {
                            res
                                .status(400)
                                .send({errors: ["Author with this id already exist"]});
                        }
                    })
                    .catch(function(err) {
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
controller.createAuthor = function (req, res) {
    let id = req.body._id;
    let resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Author.findById({_id: id}, function (err, existedAuthor) {
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
                    .then(function () {
                        res.status(201).send({author});
                    })
                    .catch(function (err) {
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