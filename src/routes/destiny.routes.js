'use strict'

const express = require('express');
const api = express.Router();
const destinyController = require('../controllers/destiny.controller');
const mdAuth = require('../services/authenticated');

// Funciones de Admin
api.get('/test', destinyController.test);
api.delete('/deleteDestiny/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], destinyController.deleteDestiny_OnlyAdmin);
api.get('/getDestinys', [mdAuth.ensureAuth, mdAuth.isAdmin], destinyController.getDestinys_OnlyAdmin);
api.get('/getDestiny/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], destinyController.getDestiny_OnlyAdmin);
api.put('/updateDestiny/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], destinyController.updateDestiny_OnlyAdmin);


// Funciones de Clientes
api.post('/addDestiny/:idTrip/:idLodge', [mdAuth.ensureAuth, mdAuth.isClient], destinyController.addDestiny);
api.get('/getDestinysClients',[mdAuth.ensureAuth, mdAuth.isClient], destinyController.getDestinys_OnlyClient);
api.get('/getDestinyClient/:id', [mdAuth.ensureAuth, mdAuth.isClient],destinyController.getDestiny_OnlyClient);
module.exports = api;