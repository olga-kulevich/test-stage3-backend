let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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
    let host = this.config.host,
        port = this.config.port,
        name = this.config.name;

    mongoose
        .connect(
            `mongodb://${host}:${port}/${name}`,
            {
                useNewUrlParser: true,
                auto_reconnect: true,
                reconnectTries: Number.MAX_VALUE,
                autoIndex: false,
                reconnectInterval: 1000
            }
        )
        .then((res) => {
            callback && callback(null, res);
        })
        .catch((err) => {
            callback && callback(err);
            console.log('Connection error: ' + err);
        });
};

/**
 * Clear database
 * @param {Function} callback - two params err, callback result
 * @returns {void}
 */
DAO.prototype.clear = function(callback) {
    //TODO clear database
    callback && callback();
};

module.exports = DAO;