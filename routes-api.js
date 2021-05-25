const Pois = require('./app/api/pois');
const Users = require('./app/api/users');
const Images = require('./app/api/images');

module.exports = [
    { method: "GET", path: "/api/pois", config: Pois.find },
    { method: "GET", path: "/api/pois/{id}", config: Pois.findOne },
    { method: "POST", path: "/api/pois", config: Pois.create },
    { method: "DELETE", path: "/api/pois/{id}", config: Pois.deleteOne },
    { method: "DELETE", path: "/api/pois", config: Pois.deleteAll },

    { method: "GET", path: "/api/users", config: Users.find },
    { method: "GET", path: "/api/users/{id}", config: Users.findOne },
    { method: "POST", path: "/api/users", config: Users.create },
    { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
    { method: "DELETE", path: "/api/users", config: Users.deleteAll },
    { method: "POST", path: "/api/users/authenticate", config: Users.authenticate },

    { method: "GET", path: "/api/users/{id}/pois", config: Pois.findByUser },

    { method: "GET", path: "/api/images", config: Images.findById },
];