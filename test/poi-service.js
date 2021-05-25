"use strict";

const axios = require("axios");

class PoiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getPois() {
        const response = await axios.get(this.baseUrl + "/api/pois");
        return response.data;
    }

    async getPoiImages(id) {
        try {
            const response = await axios.get(this.baseUrl + "/api/images/" + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getPoi(id) {
        try {
            const response = await axios.get(this.baseUrl + "/api/pois/" + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createPoi(newPoi) {
        const response = await axios.post(this.baseUrl + "/api/pois", newPoi);
        return response.data;
    }

    async deleteAllPois() {
        const response = await axios.delete(this.baseUrl + "/api/pois");
        return response.data;
    }

    async deleteOnePoi(id) {
        const response = await axios.delete(this.baseUrl + "/api/pois/" + id);
        return response.data;
    }

    async getUsers() {
        try {
            const response = await axios.get(this.baseUrl + "/api/users");
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getUser(id) {
        try {
            const response = await axios.get(this.baseUrl + "/api/users/" + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createUser(newUser) {
        try {
            const response = await axios.post(this.baseUrl + "/api/users", newUser);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllUsers() {
        try {
            const response = await axios.delete(this.baseUrl + "/api/users");
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteOneUser(id) {
        try {
            const response = await axios.delete(this.baseUrl + "/api/users/" + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getUserPois(id) {
        try {
            const response = await axios.get(this.baseUrl + "/api/users/" + id + "/pois");
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async authenticate(user) {
        try {
            const response = await axios.post(this.baseUrl + "/api/users/authenticate", user);
            axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
            return response.data;
        } catch (e) {
            return null;
        }
    }
    async clearAuth(user) {
        axios.defaults.headers.common["Authorization"] = "";
    }
}

module.exports = PoiService;