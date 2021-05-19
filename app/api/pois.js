'use strict';

const Poi = require('../models/poi');

const Pois = {
    find: {
        auth: false,
        handler: async function (request, h) {
            const pois = await Poi.find();
            return pois;
        },
    },
    findOne: {
        auth: false,
        handler: async function(request, h) {
            try {
                const poi = await Poi.findOne({ _id: request.params.id });
                if (!poi) {
                    return Boom.notFound("No POI with this id");
                }
                return poi;
            } catch (err) {
                return Boom.notFound("No POI with this id");
            }
        },
    },
    create: {
        auth: false,
        handler: async function (request, h) {
            const newPoi = new Poi(request.payload);
            const poi = await newPoi.save();
            if (poi) {
                return h.response(poi).code(201);
            }
            return Boom.badImplementation("error creating poi");
        },
    },

    deleteAll: {
        auth: false,
        handler: async function (request, h) {
            await Poi.remove({});
            return { success: true };
        },
    },

    deleteOne: {
        auth: false,
        handler: async function (request, h) {
            const response = await Poi.deleteOne({ _id: request.params.id });
            if (response.deletedCount==1) {
                return { success: true };
            }
            return Boom.notFound("id not found");
        },
    },

    findByUser: {
        auth: false,
        handler: async function (request, h) {
            const pois = await Poi.find({ user: request.params.id });
            return pois;
        },
    },
};

module.exports = Pois;