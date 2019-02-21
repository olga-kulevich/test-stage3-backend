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
        category: {
          type: String,
          required: true,
          enum: [
            "Realty",
            "Auto and transport",
            "Mechanism",
            "Fashion & Style",
            "Home",
            "Repair and construction",
            "Garden",
            "Services",
            "Other"
          ]
        },
        price: Number,
        views: Number,
        author: String,
        modified: Date,
        created: Date
    },
    {versionKey: false}
);

let Advert = mongoose.model('Advert', advertSchema);

module.exports = Advert;