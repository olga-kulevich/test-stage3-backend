'use strict';

const mongoose = require('mongoose');

const authorSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: mongoose.Schema.Types.ObjectId
        },
        email: String,
        firstName: String,
        secondName: String,
        book: Array,
        birthDate: Number
    },
    {versionKey: false}
);

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
