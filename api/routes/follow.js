'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var mdAuth = require('../middleware/authenticated');

api.post('/follow', mdAuth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', mdAuth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowedUsers);
api.get('/get-my-follows/:followed?', mdAuth.ensureAuth, FollowController.getMyFollows);

module.exports= api;