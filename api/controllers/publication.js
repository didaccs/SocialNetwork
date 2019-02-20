'use strict'

var mongoosePaginate = require('../lib/pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Publication = require('../models/publication');
var Users = require('../models/user');
var Follow = require('../models/follow');

function test(req,res) {
    res.status(200).send({
        message : "Hola desde publicaciones"
    });
}

function savePublication(req,res) {
    var params = req.body;

    if(!params.text) return res.status(200).send({message: 'Debes enviar texto'});

    var publication = new Publication();
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err,pubStored)=>{
        if(err) return res.status(500).send({message: 'Error al guardar la publicación'});
        if(!pubStored) return res.status(404).send({message: 'La publicación no se ha guardado'});
        return res.status(200).send({publication:pubStored});
    });
}

function getPublications(req,res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsForPage = 4;

    Follow.find({user:userId}).populate('followed').exec().then((follows)=>{
        var follows_clean = [];
        follows.forEach(follow => {                        
            follows_clean.push(follow.followed);
        });

        follows_clean.push(userId);

        Publication.find({user: {"$in": follows_clean} }).sort('-created_at').populate('user').paginate(page, itemsForPage,(err,publications, total)=>{
            if (err) return res.status(500).send({ message: 'Error en la petición de las publicaciones' });
            if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });

            return res.status(200).send({
                total_items:total,
                pages: Math.ceil(total / itemsForPage),
                page:page,
                itemsPerPage: itemsForPage,
                publications
            });
        });
        
    }).catch((err)=>{
        console.log(err);
    });
}

function getPublicationsUser(req,res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var user = req.user.sub;
    if (req.params.user) {
        user = req.params.user;
    }

    var itemsForPage = 4;

    Publication.find({user: user }).sort('-created_at').populate('user').paginate(page, itemsForPage,(err,publications, total)=>{
        if (err) return res.status(500).send({ message: 'Error en la petición de las publicaciones' });
        if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });

        return res.status(200).send({
            total_items:total,
            pages: Math.ceil(total / itemsForPage),
            page:page,
            itemsPerPage: itemsForPage,
            publications
        });
    });

}

function getPublication(req,res) {
    var pubId = req.params.id;

    Publication.findById(pubId, (err,publication)=>{
        if (err) return res.status(500).send({ message: 'Error en la petición de la publicacion' });
        if (!publication) return res.status(404).send({ message: 'No existe la publicación' });

        return res.status(200).send({publication});
    });
}

function deletePublication(req,res) {
    var pubId = req.params.id;

    Publication.find({user:req.user.sub, '_id':pubId}).remove((err)=>{
        if (err) return res.status(500).send({ message: 'Error al borrar la publicacion' });
        
        return res.status(200).send({message:'Publicación eliminada'});
    });    
}

function uploadImage(req, res) {
    var publicationId = req.params.id;
    var update = req.body;   

    if (req.files) {
        var file_path = req.files.image.path;
        var file_name = file_path.split('\\')[2];
        var file_ext = file_name.split('\.')[1];        

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            Publication.findOne({'user': req.user.sub, '_id':publicationId}).exec().then((publication)=>{

                if(publication){
                    Publication.findByIdAndUpdate(publicationId, {file: file_name}, { new: true }, (err, pubUpdate) => {
                        if (err) return res.status(500).send({ message: 'Error en la subida de la imagen en la publicación' });
                        if (!pubUpdate) return res.status(404).send({ message: 'No se han subido las imagenes' });
        
                        return res.status(200).send({ publication: pubUpdate });
                    });
                }
                else{
                    return removeFilesOfUploads(res, file_path, 'No tienes permiso para esta publicación.');        
                }
                
            }).catch((err)=>{
                console.log(err);
            });

           
        } else {
            return removeFilesOfUploads(res, file_path, 'La extensión no es valida.');
        }

    } else {
        return res.status(200).send({ message: 'No se han subido archivos.' });
    }    
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/' + image_file;

    fs.exists(path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve(path_file));
        }
        else{
            return res.status(200).send({ message: 'No existe la imagen' });
        }

    });
}

module.exports={
    test,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile,
    getPublicationsUser
}