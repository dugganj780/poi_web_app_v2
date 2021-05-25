"use strict";

const Accounts = require("./app/controllers/accounts");
const Pois = require("./app/controllers/pois");
const os = require("os");

module.exports = [
    { method: "GET", path: "/", config: Accounts.index },
    { method: "GET", path: "/signup", config: Accounts.showSignup },
    { method: "GET", path: "/login", config: Accounts.showLogin },
    { method: "GET", path: "/logout", config: Accounts.logout },
    { method: "POST", path: "/signup", config: Accounts.signup },
    { method: "POST", path: "/login", config: Accounts.login },
    { method: "GET", path: "/settings", config: Accounts.showSettings },
    { method: "POST", path: "/settings", config: Accounts.updateSettings },
    { method: "GET", path: "/userview", config: Accounts.listUsers },
    { method: "GET", path: "/deleteuser/{_id}", config: Accounts.deleteUser },

    { method: "GET", path: "/home", config: Pois.home },
    { method: 'POST', path: '/createPoi', config: Pois.createPoi },
    { method: 'GET', path: '/addpoi', config: Pois.addpoi },
    { method: "GET", path: "/report", config: Pois.report },
    { method: "GET", path: "/poiview/{_id}", config: Pois.singlePoi },
    { method: "POST", path: "/uploadFile", config: Pois.uploadFile },
    { method: "GET", path: "/updatepoi", config: Pois.showPoiEdit },
    { method: "POST", path: "/updatepoi", config: Pois.updatePoi },
    { method: "GET", path: "/deletepoi", config: Pois.deletePoi },
    { method: "POST", path: "/addcomment", config: Pois.addComment },

    {
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: "./public",
            },
        },
        options: { auth: false },
    },

    {
        method: 'GET',
        path: '/testlb',
        handler: function (request, h) {
            return('Server: ' + os.hostname());
        },
        config: {auth: false}    // so you don't need to log in first to test it.
    },
];