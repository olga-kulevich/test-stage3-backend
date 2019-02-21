'use strict';

const Advert = require('../dao/advert');
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
        case 'updateAdvert':
            return [
                body('title', 'Title is require').exists({checkFalsy: true})
            ];
        case 'createAdvert':
            return [
                body('title', 'Title is require').exists({checkFalsy: true})
            ];
        case 'patchAdvert':
            return [
                body ('title', 'Title is require')
                    .exists({checkFalsy: true})
                    .optional()
            ];
    }
};

/** 
 * Send specific advert entity by id
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getAdvertById = (req, res) => {
    Advert.findById({_id: req.params.id})
        .then((advert) => {
            if (advert) {
                res.status(200).send(advert);
            } else {
                res.status(404).send({errors: ["Advert not exist"]});
            }
        })
        .catch((error) => {
            res.status(400).send({error});
        });
};


/**
 * Send advert collection
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.getAdverts = (req, res) => {
    const direction = req.query.direction;
    const filter = {};
    if (req.query.price) {
        filter.price = req.query.price;
    }
    if (req.query.title) {
        filter.title = new RegExp(req.query.title, 'i');
    }
    Advert.find(filter, null, {sort: {price: direction}})
        .then((allAdverts) => {
            res.status(200).send(allAdverts);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
};

/**
 * Update advert
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.updateAdvert = (req, res) => {
    const id = req.params.id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Advert.findById({_id: id}, (err, existingAdvert) => {
            if (existingAdvert && (!req.body._id || existingAdvert._id === req.body._id)) {
                Advert.findOneAndUpdate(
                    {_id: id},
                    {
                        $set: {
                            title: req.body.title,
                            description: req.body.description,
                            category: req.body.category,
                            price: req.body.price,
                            author: req.body.author
                        }
                    },
                    {new: true, runValidators: true}
                )
                    .then((advert) => {
                        res.status(200).send(advert);
                    })

                    .catch((err) => {
                        console.error(err);
                    })
            } else if (!existingAdvert) {
                res.status(404).send({errors: ["Advert not exist"]});
            } else if (existingAdvert._id !== req.body._id){
                Advert.findById({_id: req.body._id})
                    .then((findAdvert) => {
                        if (findAdvert) {
                            res
                                .status(400)
                                .send({errors: ["Advert with this id already exist"]});
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
 * Patch advert
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.patchAdvert = (req, res) => {
    const id = req.params.id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Advert.findById({_id: id}, (err, existingAdvert) => {
            if (existingAdvert && (!req.body._id || existingAdvert._id === req.body._id)) {
                if (req.body._id) {
                    delete req.body._id;
                }
                for (let pr in req.body) {
                    existingAdvert[pr] = req.body[pr];
                }
                existingAdvert.save()
                    .then((advert) => {
                        res.status(200).send(advert);
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            } else if (!existingAdvert) {
                res.status(404).send({errors: ["Advert not exist"]});
            } else if (req.body._id) {
                Advert.findById({_id: req.body._id})
                    .then((findAdvert) => {
                        if (findAdvert) {
                            res
                                .status(400)
                                .send({errors: ["Advert with this id already exist"]});
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
 * Create advert
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.createAdvert = (req, res) => {
    let id = req.body._id;
    const resultValidation = validationResult(req).formatWith(errorFormatter);

    if (!resultValidation.isEmpty()) {
        res.status(400).send({errors: resultValidation.array()});
    } else {
        Advert.findById({_id: id}, (err, existedAdvert) => {
            if (!existedAdvert) {
                if (!id) {
                    id = new mongoose.Types.ObjectId();
                }

                const advert = new Advert({
                    _id: id,
                    title: req.body.title,
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    author: req.body.author
                });

                advert.save()
                    .then((advert) => {
                        res.status(201).send({advert});
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                res
                    .status(400)
                    .send({errors: ["Advert with this id already exist"]});
            }
        });
    }
};

/**
 * Delete advert
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {void}
 */
controller.removeAdvert = (req, res) => {
    Advert.findByIdAndRemove({_id: req.params.id})
        .then((item) => {
            if (!item) {
                res.status(404).send({errors: ["Advert not exist"]});
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