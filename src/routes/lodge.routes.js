'use strict'

const express = require('express');
const api = express.Router();
const lodgeController = require('../controllers/lodge.controller');
const mdAuth = require('../services/authenticated');

api.get('/test', lodgeController.testLodge);
api.post('/addLodge/:idDepartment/:idCategory', [mdAuth.ensureAuth, mdAuth.isAdmin], lodgeController.addLodge);
api.get('/getLodges', [mdAuth.ensureAuth,mdAuth.isAdmin], lodgeController.getLodges_OnlyAdmin);
api.get('/getLodge/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], lodgeController.getLodge_OnlyAdmin);
api.delete('/deleteLodge/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], lodgeController.deleteLodge_OnlyAdmin);
// Funciones de Clientes

api.get('/getLodgesClients', lodgeController.getLodges_OnlyClient);
api.get('/getLodgeClient/:id', lodgeController.getLodge_OnlyClient);

module.exports = api;