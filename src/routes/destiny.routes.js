'use strict'

const express = require('express');
const api = express.Router();
const destinyController = require('../controllers/destiny.controller');
const mdAuth = require('../services/authenticated');

// Funciones de Admin
api.get('/test', destinyController.test);
api.post('/addDestiny/:idTrip/:idLodge', [mdAuth.ensureAuth, mdAuth.isClient], destinyController.addDestiny);
api.delete('/deleteDestiny/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], destinyController.deleteDestiny_OnlyAdmin);
api.get('/getDestinys', [mdAuth.ensureAuth, mdAuth.isAdmin], destinyController.getDestinys_OnlyAdmin);
api.get('/getDestiny/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], destinyController.getDestiny_OnlyAdmin);
api.put('/updateDestiny/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], destinyController.updateDestiny_OnlyAdmin);


// Funciones de Clientes
api.get('/getDestinysClients', destinyController.getDestinys_OnlyClient);
api.get('/getDestinyClient/:id', destinyController.getDestiny_OnlyClient);
module.exports = api;