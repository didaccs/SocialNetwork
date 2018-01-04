'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('../lib/pagination');
var fs = require('fs');
var path = require('path');

// test method
function home(req, res) {
    res.status(200).send({
        message: 'Home usuarios'
    });
}

// test method
function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({
        message: 'accion de prueba'
    });
}

// Register new user
function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        // check if exist user
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) res.status(500).send({ message: 'Error en al peticion de usuarios' });
            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'El usuario ya existe' });
            }
            else {
                // encode pass and save user
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });
                        if (userStored) {
                            res.status(200).send({ user: userStored });
                        } else {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        }
                    })
                });
            }
        });
    }
    else {
        res.status(200).send({
            message: 'Envia todos los campos' + req.body
        });
    }
}

// Login user
function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.getToken) {
                        return res.status(200).send({ token: jwt.createToken(user) });
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(404).send({ message: 'El password del usuario no es valido' });
                }
            })
        }
        else {
            return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
        }
    })
}

// Get only one user
function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la petición del usuario' });
        if (!user) return res.status(404).send({ message: 'El usuario no existe' });

        return res.status(200).send({ user });

    });
}

// Get user list with pagination
function getUsers(req, res) {
    var identityUserId = req.user.sub; // sub por el payload del token

    var page = 1;
    var itemsForPage = 5;
    if (req.params.page) {
        page = req.params.page;
    }

    User.find().sort('_id').paginate(page, itemsForPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición de los usuarios' });
        if (!users) return res.status(404).send({ message: 'No se han encontrado usuarios' });

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsForPage)
        })
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permisos para modificar este usuario.' });
    }

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdate) => {
        if (err) return res.status(500).send({ message: 'Error en la actualización del usuario' });
        if (!userUpdate) return res.status(404).send({ message: 'No se han actualizado el usuario' });

        return res.status(200).send({ user: userUpdate });
    });

}

function uploadImage(req, res) {
    var userId = req.params.id;
    var update = req.body;   

    if (req.files) {
        var file_path = req.files.image.path;
        var file_name = file_path.split('\\')[2];
        var file_ext = file_name.split('\.')[1];

        if (userId != req.user.sub) {
            return removeFilesOfUploads(res, file_path, 'No tienes permisos para modificar la imagen de este usuario.' );
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            User.findByIdAndUpdate(userId, {image:file_name}, { new: true }, (err, userUpdate) => {
                if (err) return res.status(500).send({ message: 'Error en la actualización del usuario' });
                if (!userUpdate) return res.status(404).send({ message: 'No se han actualizado el usuario' });
        
                return res.status(200).send({ user: userUpdate });
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
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists)=>{
        if (exists) {
            res.sendFile(path.resolve(path_file));
        }
        else{
            return res.status(200).send({ message: 'No existe la imagen' });
        }

    });
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}