'use strict'

var mongoosePaginate = require('../lib/pagination');
var moment = require('moment');

var Users = require('../models/user');
var Message = require('../models/message');
var Follow = require('../models/follow');

function testMessage(req, res) {
    return res.status(200).send({ message: 'Hola desde messages' });
}

function saveMessage(req, res) {
    var params = req.body;
    if (!params.text) return res.status(200).send({ message: 'Debes enviar texto' });
    if (!params.receiver) return res.status(200).send({ message: 'Debes rellenar a quien envias el mensaje' });

    var message = new Message();

    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageSaved) => {
        if (err) return res.status(200).send({ message: 'Error en la petición de mensaje' });
        if (!messageSaved) return res.status(500).send({ message: 'No se ha podido enviar el mensaje' });

        return res.status(200).send({ messageSaved });
    });
}

function getReceivedMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    var itemsForPage = 4;
    if (req.params.page) {
        page = req.params.page;
    }

    Message.find({ receiver: userId }).populate('emitter', 'name surname _id nick image').sort('-created_at')
    .paginate(page, itemsForPage, (err, messages, total) => {
        if (err) return res.status(200).send({ message: 'Error en la petición de mensajes' });
        if (!messages) return res.status(404200).send({ message: 'No hay mensajes' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsForPage),
            messages: messages
        });
    });
}

function getEmitMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    var itemsForPage = 4;
    if (req.params.page) {
        page = req.params.page;
    }

    Message.find({ emitter: userId }).populate('emitter receiver', 'name surname _id nick image').sort('-created_at')
    .paginate(page, itemsForPage, (err, messages, total) => {
        if (err) return res.status(200).send({ message: 'Error en la petición de mensajes' });
        if (!messages) return res.status(404200).send({ message: 'No hay mensajes' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsForPage),
            messages: messages
        });
    });
}

function getUnviewedMessages(req, res) {
    var userId = req.user.sub;

    Message.count({ receiver: userId, viewed: 'false' }).exec().then((count) => {
        return res.status(200).send({'unviewed': count});
    }).catch((err) => {
        console.log(err);
    });
}

function setViewedMessage(req,res) {
    var userId = req.user.sub;

    Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {"multi":true}, (err, msgUpdate)=>{
        if (err) return res.status(500).send({ message: 'Error en la petición de mensajes' });
        return res.status(200).send({
            messages:msgUpdate
        });
    });
}


module.exports = {
    testMessage,
    saveMessage,
    getReceivedMessages,
    getEmitMessages,
    getUnviewedMessages,
    setViewedMessage
}