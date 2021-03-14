'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const Poi = require("../models/poi");

const ImageStore = {
    configure: function() {
        const credentials = {
            cloud_name: process.env.name,
            api_key: process.env.key,
            api_secret: process.env.secret
        };
        cloudinary.config(credentials);
    },

    getAllImages: async function() {
        const result = await cloudinary.v2.api.resources();
        return result.resources;
    },

    getPOIImages: async function(id) {
        const result = await cloudinary.v2.api.resources_by_tag(id, function(error, result) {console.log(result, error); });
        return result.resources;
    },

    uploadImage: async function(imagefile, id) {
        await writeFile('./public/temp.img', imagefile);
        await cloudinary.v2.uploader.upload('./public/temp.img', {tags:id});
    },

    deleteImage: async function(id) {
        await cloudinary.v2.uploader.destroy(id, {});
    },

};

module.exports = ImageStore;