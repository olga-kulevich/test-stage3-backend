'use strict';

/**
 * Format validation result (error)
 * @param {{msg: String}} error - error argument
 * @returns {String} error text message
 */
const errorFormatter = function errorFormatter({msg}) {
    return `${msg}`;
};

module.exports = errorFormatter;