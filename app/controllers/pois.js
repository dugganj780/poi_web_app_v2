"use strict";
const Poi = require("../models/poi");
const User = require("../models/user");

const Pois = {
    home: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id).lean();
            const pois = await Poi.find({user: user}, function (err, doc){}).populate("user").lean();
            return h.view("home", {
                title: "My Points of Interest",
                pois: pois,
                user: user,
            });
        },
    },
    addpoi: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id).lean();
            const pois = await Poi.find({user: user}, function (err, doc){}).populate("user").lean();
            return h.view("addpoi", {
                title: "Add a Point of Interest",
                pois: pois,
                user: user,
            });
        },
    },
    singlePoi: {
        handler: async function (request, h) {
            const userId = request.auth.credentials.id;
            const user = await User.findById(userId).lean();
            const id = request.auth.credentials.id;
            const poi = await Poi.findById(id).lean();
            return h.view("poiview", {
                title: "POI",
                poi: poi,
                user: user,
            });
        },
    },
    report: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id).lean();
            const pois = await Poi.find().populate("user").lean();
            return h.view("report", {
                title: "Points of Interest",
                pois: pois,
                user: user,
            });
        },
    },
    /*userreport: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id);
            const userpois = await Poi.find({user: user}, function (err, docs){}).lean();
            return h.view("home", {
                title: "Points of Interest",
                userpois: userpois,
            });
        },
    },*/
    createPoi: {
        handler: async function (request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                const data = request.payload;
                const newPoi = new Poi({
                    name: data.name,
                    category: data.category,
                    description: data.description,
                    lat: data.lat,
                    long: data.long,
                    rating: data.rating,
                    user: user._id
                });
                await newPoi.save();
                return h.redirect("/report");
            }catch (err) {
                return h.view("main", { errors: [{ message: err.message }] });
            }
        },
    },
};

module.exports = Pois;