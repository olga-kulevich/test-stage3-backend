'use strict';

const mongoose = require('mongoose');
const Author = require('../dao/author');
const Advert = require('../dao/advert');

/**
 * Data Access Layer
 *
 * @constructor
 * @param {Object} config - database config
 */
function DAO(config) {
    this.config = config;
}

/**
 * Create database instance and load init data
 * @param {Object} data - init database data
 * @param {Function} callback - two params err, callback result
 * @returns {void}
 */
DAO.prototype.init = function (data, callback) {
    const host = this.config.host;
    const port = this.config.port;
    const name = this.config.name;
    let quantityInserted = 0;
    let quantityToInsert = 0;

    mongoose.Promise = global.Promise;

    mongoose
        .connect(
            `mongodb://${host}:${port}/${name}`,
            {
                useFindAndModify: false,
                useNewUrlParser: true,
                auto_reconnect: true,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            }
        )
        .then((connection) => {
            if (data && data.collections) {

                data.collections.forEach((collection) => {
                    quantityToInsert = quantityToInsert + collection.rows.length;
                });

                data.collections.forEach((collection) => {
                    if (collection.name === 'authors') {
                        collection.rows.forEach((authorData) => {
                            const author = new Author(authorData);
                            author.save()
                                .then(function() {
                                    quantityInserted++;
                                    if (quantityInserted === quantityToInsert){
                                        callback && callback(null, connection);
                                    }
                                })
                                .catch((err) => {
                                    callback && callback(err);
                                });
                        });
                    }
                    if (collection.name === 'adverts') {
                        collection.rows.forEach((advertData) => {
                            const advert = new Advert(advertData);
                            advert.save()
                                .then(() => {
                                    quantityInserted++;
                                    if (quantityInserted === quantityToInsert){
                                        callback && callback(null, connection);
                                    }
                                })
                                .catch((err) => {
                                    callback && callback(err);
                                });
                        });
                    }
                });
            }
            callback && callback();
        })
        .catch((error) => {
            callback && callback(error);
        });
};

/**
 * Clear database
 * @param {Function} callback - two params err, callback result
 * @returns {void}
 */
DAO.prototype.clear = (callback) => {
    mongoose.connection.dropDatabase()
        .then((result) => {
            callback && callback(null, result);
        })
        .catch((err) => {
            callback && callback(err);
        });
};

module.exports = DAO;