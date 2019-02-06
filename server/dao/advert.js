'use strict';

let mongoose = require('mongoose');

const advertSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: mongoose.Schema.Types.ObjectId
        },
        title: String,
        description: String,
        category: String,
        price: Number,
        views: Number,
        author: Number,
        modified: Date,
        created: Date
    },
    {versionKey: false}
);

let Advert = mongoose.model('Advert', advertSchema);

module.exports = Advert;