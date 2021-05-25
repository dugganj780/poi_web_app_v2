"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
    name: String,
    category: String,
    description: String,
    lat: Number,
    long: Number,
    rating: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    comments:[],
});

module.exports = Mongoose.model("Poi", poiSchema);