'use strict'

const express = require('express');
const tripController = require('../controllers/trip.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

// Funciones de administrador
api.get('/testTrip', tripController.prueba),
api.post('/addTrip',[mdAuth.ensureAuth, mdAuth.isAdmin],tripController.addTrip); 
api.put('/updateTrip/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], tripController.updateTrip); 
api.delete('/deleteTrip/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], tripController.deleteTrip);
api.get('/getTrips',[mdAuth.ensureAuth, mdAuth.isAdmin], tripController.getTripsOnlyAdmin); 
api.get('/getTrip/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], tripController.getTrip_OnlyAdmin); 

//Funciones de Clientes
api.get('/getTripsClient', [mdAuth.ensureAuth, mdAuth.isClient],tripController.getTripsOnlyClient); 
api.get('/getTripClient/:id', [mdAuth.ensureAuth, mdAuth.isClient],tripController.getTrip_OnlyClient); 

module.exports = api;