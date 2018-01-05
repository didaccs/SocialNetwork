'use strict'

var mongoosePaginate = require('../lib/pagination');
var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res) {
    var follow = new Follow();
    var params = req.body;

    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar el seguimiento' });
        if (!followStored) return res.status(404).send({ message: 'El seguimiento no se ha guardado' });

        return res.status(200).send({ followStored });
    });
}

function deleteFollow(req, res) {
    var userId = req.user.sub;
    var unfollowId = req.params.id;

    Follow.find({ 'user': userId, 'followed': unfollowId }).remove((err) => {
        if (err) return res.status(500).send({ message: 'Error al dejar de seguir' });

        return res.status(200).send({ message: 'El follow se ha borrado' });
    });
}

function getFollowingUsers(req, res) {
    var userId = req.user.sub;
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsForPage = 4;

    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsForPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'No se pueden obtener los seguidos' });
        if (!follows) return res.status(404).send({ message: 'No se está siguiendo a nadie' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsForPage),
            follows
        });
    });
}

function getFollowedUsers(req,res) {
    var userId = req.user.sub;
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsForPage = 4;

    Follow.find({ followed: userId }).populate('user').paginate(page, itemsForPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'No se pueden obtener los seguidores' });
        if (!follows) return res.status(404).send({ message: 'No te está siguiendo nadie' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsForPage),
            follows
        });
    });
}

function getMyFollows(req,res) {
    var userId = req.user.sub;

    var find = Follow.find({ user: userId });

    if (req.params.followed){
        find = Follow.find({ followed: userId });
    }

    find.populate( 'user followed').exec((err,follows)=>{
        if (err) return res.status(500).send({ message: 'No se pueden obtener los seguidos' });
        if (!follows) return res.status(404).send({ message: 'No se está siguiendo a nadie' });

        return res.status(200).send({follows});
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}
