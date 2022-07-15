
'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const userRoutes = require('../src/routes/user.routes');
app.use(helmet()); //Seguridad de Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); //Aceptar solicitudes

//Configuración de rutas
app.use('/user', userRoutes);

module.exports = app;