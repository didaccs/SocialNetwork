'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var mdAuth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');

var api = express.Router();
var mdUpload = multipart({uploadDir: './uploads/users'});


api.get('/home', UserController.home);
api.get('/pruebas', mdAuth.ensureAuth, UserController.pruebas);
api.get('/user/:id', mdAuth.ensureAuth, UserController.getUser);
api.get('/counters/:id?', mdAuth.ensureAuth, UserController.getCounters);
api.get('/users/:page?', mdAuth.ensureAuth, UserController.getUsers);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/upload-image-user/:id', [ mdAuth.ensureAuth, mdUpload], UserController.uploadImage);

module.exports = api;