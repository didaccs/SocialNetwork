'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Conexion Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/social_network')
        .then(()=>{
            console.log("Conexión a BD de MONGO realizada correctamente.");

            //Create server
            app.listen(port, ()=>{
                console.log("Servidor corriendo en http://localhost:" + port);
            });
        })
        .catch(err=>{
            console.log(err);
        });
