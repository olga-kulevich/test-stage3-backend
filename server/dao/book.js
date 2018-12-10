'use strict';

let mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: mongoose.Schema.Types.ObjectId
        },
        name: String,
        publishing: String,
        ebook: Boolean,
        isbn: String,
        author: Array,
        pages: Number,
        year: Number
    },
    {versionKey: false}
);

let Book = mongoose.model('Book', bookSchema);

module.exports = Book;