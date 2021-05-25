'use strict';
const User = require('../models/user');
const Boom = require("@hapi/boom");
const Joi = require('@hapi/joi');
const bcrypt = require("bcrypt");
const saltRounds = 10;


const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'POIs Ireland' });
        }
    },
    showSignup: {
        auth: false,
        handler: function(request, h) {

            return h.view('signup', { title: 'Sign up' });
        }
    },
    signup: {
        auth: false,
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            },
            options: {
                abortEarly: false,
            },
            failAction: function (request, h, error) {
                return h
                    .view("signup", {
                        title: "Sign up error",
                        errors: error.details,
                    })
                    .takeover()
                    .code(400);
            },
        },
        handler: async function(request, h) {
            try {
                const payload = request.payload;
                let user = await User.findByEmail(payload.email);
                if (user) {
                    const message = "Email address is already registered";
                    throw Boom.badData(message);
                }
                const hash = await bcrypt.hash(payload.password, saltRounds)
                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: hash,
                    isAdmin: false,
                });
                user = await newUser.save();
                request.cookieAuth.set({ id: user.id });
                return h.redirect("/home");
            } catch (err) {
                return h.view("signup", { errors: [{ message: err.message }] });
            }
        }
    },
    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login' });
        }
    },
    login: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            },
            options: {
                abortEarly: false,
            },
            failAction: function (request, h, error) {
                return h
                    .view("login", {
                        title: "Sign in error",
                        errors: error.details,
                    })
                    .takeover()
                    .code(400);
            },
        },
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = "Email address is not registered";
                    throw Boom.unauthorized(message);
                }
                await user.comparePassword(password);
                request.cookieAuth.set({ id: user.id });
                return h.redirect("/home");
            } catch (err) {
                return h.view("login", { errors: [{ message: err.message }] });
            }
        }
    },
    logout: {
        auth: false,
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    },
    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                return h.view("settings", { title: "Donation Settings", user: user });
            } catch (err) {
                return h.view("login", { errors: [{ message: err.message }] });
            }
        }
    },
    updateSettings: {
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            },
            options: {
                abortEarly: false,
            },
            failAction: function (request, h, error) {
                return h
                    .view("settings", {
                        title: "Sign up error",
                        errors: error.details,
                    })
                    .takeover()
                    .code(400);
            },
        },
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;
                const hash = await bcrypt.hash(userEdit.password, saltRounds);
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = hash;
                await user.save();
                return h.redirect("/settings");
            }catch (err){
                return h.view("main", { errors: [{ message: err.message }] });
            }
        }
    },
    listUsers: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id).lean();
            const users = await User.find().lean();
            return h.view("userview", {
                title: "Registered Users",
                users: users,
                user: user,
            });
        },
    },
    deleteUser: {
        handler: async function (request, h) {
            try {
                const id = request.params._id;
                console.log(id)
                const user = await User.findById(id);
                user.deleteOne({_id: id}, function(err){
                    /*if(err) console.log(err);
                    console.log("Successful deletion");*/
                });
                return h.redirect("/userview");
            }catch (err) {
                return h.view("home", { errors: [{ message: err.message }] });
            }
        },
    },
};

module.exports = Accounts;