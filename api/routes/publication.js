'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var mdAuth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/publications'});

var api = express.Router();

api.get('/test', mdAuth.ensureAuth, PublicationController.test);
api.get('/publications/:page?', mdAuth.ensureAuth, PublicationController.getPublications);
api.post('/publication', mdAuth.ensureAuth, PublicationController.savePublication);
api.get('/publication/:id', mdAuth.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', mdAuth.ensureAuth,PublicationController.deletePublication);
api.post('/upload-image-pub/:id', [mdAuth.ensureAuth, mdUpload], PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

module.exports = api;