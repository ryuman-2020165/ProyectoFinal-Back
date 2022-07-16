'use strict'

const express = require('express');
const tripController = require('../controllers/trip.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');


api.get('/testTrip', tripController.prueba),

api.post('/addTrip',mdAuth.ensureAuth,tripController.addTrip); 

api.get('/getTrip/:id', mdAuth.ensureAuth, tripController.getTrip); 

api.put('/updateTrip/:id', mdAuth.ensureAuth, tripController.updateTrip); 

api.delete('/deleteTrip/:id', mdAuth.ensureAuth, tripController.deleteTrip);

module.exports = api;