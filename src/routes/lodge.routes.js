'use strict'

const express = require('express');
const api = express.Router();
const lodgeController = require('../controllers/lodge.controller');
const mdAuth = require('../services/authenticated');

const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/lodges' });

//Funciones de Admin
api.get('/test', lodgeController.testLodge);
api.post('/addLodge/:idDepartment/:idCategory', [mdAuth.ensureAuth, mdAuth.isAdmin], lodgeController.addLodge);
api.get('/getLodges', [mdAuth.ensureAuth, mdAuth.isAdmin], lodgeController.getLodges_OnlyAdmin);
api.get('/getLodge/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], lodgeController.getLodge_OnlyAdmin);
api.delete('/deleteLodge/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], lodgeController.deleteLodge_OnlyAdmin);
api.put('/updateLodge/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], lodgeController.updateLodge_OnlyAdmin);


// Funciones de Clientes
api.get('/getLodgesClients', lodgeController.getLodges_OnlyClient);
api.get('/getLodgeClient/:id', lodgeController.getLodge_OnlyClient);

// Agregar Imagen
api.post('/uploadImageLodge/:id', [mdAuth.ensureAuth, mdAuth.isAdmin, upload], lodgeController.uploadImageLodge);
api.get('/getImageLodge/:fileName', upload, lodgeController.getImageLodge);

module.exports = api;