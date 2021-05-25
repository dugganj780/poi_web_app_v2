'use strict';

const Image = require('../models/image-store');

const Images = {
    findById: {
        auth: false,
        handler: async function (request, h) {
            const pois = await Image.getPOIImages({ user: request.params.id });
            return pois;
        },
    },
}

module.exports = Images