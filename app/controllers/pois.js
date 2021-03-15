"use strict";
const Poi = require("../models/poi");
const User = require("../models/user");
const ImageStore = require('../models/image-store');
let currentPoi = undefined;


const Pois = {
    home: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id).lean();
            console.log(user);
            const pois = await Poi.find({user: user}, function (err, doc){}).populate("user").lean();
            const mountains = await Poi.find({category: "Mountain", user: user}, function (err, doc){}).populate("user").lean();
            const natMons = await Poi.find({category: "National Monument", user: user}, function (err, doc){}).populate("user").lean();
            const forests = await Poi.find({category: "Forest", user: user}, function (err, doc){}).populate("user").lean();
            const islands = await Poi.find({category: "Island", user: user}, function (err, doc){}).populate("user").lean();
            return h.view("home", {
                title: "My Points of Interest",
                pois: pois,
                user: user,
                natMons: natMons,
                mountains: mountains,
                forests: forests,
                islands: islands,
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
            const id = request.params._id;
            currentPoi = await Poi.findById(id).populate("user").lean();
            const slideshow = await ImageStore.getPOIImages(id);
            console.log(id);
            let isOwner = false;
            console.log(user._id)
            if (user.isAdmin===true || user._id.toString() === currentPoi.user._id.toString() ){
                isOwner = true;
            }
            console.log(isOwner)
            return h.view("poiview", {
                title: "POI",
                poi: currentPoi,
                user: user,
                slideshow: slideshow,
                isOwner: isOwner,
            });
        },
    },
    /*report: {
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
    },*/
    report: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id).lean();
            const pois = await Poi.find().populate("user").lean();
            const mountains = await Poi.find({category: "Mountain"}, function (err, doc){}).populate("user").lean();
            const natMons = await Poi.find({category: "National Monument"}, function (err, doc){}).populate("user").lean();
            const forests = await Poi.find({category: "Forest"}, function (err, doc){}).populate("user").lean();
            const islands = await Poi.find({category: "Island"}, function (err, doc){}).populate("user").lean();
            return h.view("report", {
                title: "Points of Interest",
                pois: pois,
                user: user,
                natMons: natMons,
                mountains: mountains,
                forests: forests,
                islands: islands,
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
    uploadFile: {
        handler: async function(request, h) {
            try {
                const file = request.payload.imagefile;
                const id = currentPoi._id;
                /*const poi = await Poi.findById(id).populate("user").lean();*/
                console.log(currentPoi);
                if (Object.keys(file).length > 0) {
                    await ImageStore.uploadImage(request.payload.imagefile,id);
                    console.log(id);
                    console.log("File Uploaded");
                    return h.redirect("/report");
                }
                return h.redirect("/report");
            } catch (err) {
                console.log(err);
            }
        },
        payload: {
            multipart: true,
            output: 'data',
            maxBytes: 209715200,
            parse: true
        }
    },
    updatePoi: {
        handler: async function (request, h) {
            try {
                const poiEdit = request.payload;
                const id = currentPoi._id;
                const poi = await Poi.findById(id).populate("user");
                poi.name = poiEdit.name;
                console.log(poi)
                poi.category = poiEdit.category;
                poi.description = poiEdit.description;
                poi.lat = poiEdit.lat;
                poi.long = poiEdit.long;
                poi.rating = poiEdit.rating;
                console.log(poi)
                await poi.save();
                console.log(poi)
                return h.redirect("/report");
            }catch (err) {
                return h.view("updatepoi", { errors: [{ message: err.message }] });
            }
        },
    },
    showPoiEdit: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                const poi = currentPoi;
                return h.view("updatepoi", { title: "Update POI", user: user, poi: poi });
            } catch (err) {
                return h.view("report", { errors: [{ message: err.message }] });
            }
        }
    },
    deletePoi: {
        handler: async function (request, h) {
            try {
                const id = currentPoi._id;
                const poi = await Poi.findById(id).populate("user");
                poi.deleteOne({_id: poi._id}, function(err){
                    /*if(err) console.log(err);
                    console.log("Successful deletion");*/
                });
                return h.redirect("/report");
            }catch (err) {
                return h.view("poiview", { errors: [{ message: err.message }] });
            }
        },
    },
};

module.exports = Pois;