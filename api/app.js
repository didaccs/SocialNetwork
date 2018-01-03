'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas


// middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// cors


// rutas
app.get('/', (req,res)=>{
    res.status(200).send({
        message: 'Hola Mundo'
    });
});

app.get('/pruebas', (req,res)=>{
    res.status(200).send({
        message: 'accion de prueba'
    });
});

// export
module.exports = app;