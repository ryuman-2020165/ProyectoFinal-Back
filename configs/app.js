
'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const userRoutes = require('../src/routes/user.routes');
const categoryRoutes = require('../src/routes/category.routes');
const departmentRoutes = require('../src/routes/department.routes');
const tripRoutes = require('../src/routes/trip.routes');
const lodgeRoutes = require('../src/routes/lodge.routes');

app.use(helmet()); //Seguridad de Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); //Aceptar solicitudes

//Configuración de rutas
app.use('/user', userRoutes);
app.use('/category',categoryRoutes);
app.use('/department', departmentRoutes);
app.use('/trip', tripRoutes);
app.use('/lodge', lodgeRoutes);



module.exports = app;