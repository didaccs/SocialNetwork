'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var mdAuth = require('../middleware/authenticated');

api.get('/testmessage', mdAuth.ensureAuth, MessageController.testMessage);
api.post('/message', mdAuth.ensureAuth, MessageController.saveMessage);
api.get('/received-messages', mdAuth.ensureAuth, MessageController.getReceivedMessages);
api.get('/emit-messages', mdAuth.ensureAuth, MessageController.getEmitMessages);
api.get('/unviewed-messages', mdAuth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', mdAuth.ensureAuth, MessageController.setViewedMessage);

module.exports= api;