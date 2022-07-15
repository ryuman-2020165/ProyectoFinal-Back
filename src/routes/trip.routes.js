'use strict'

const express = require('express');
const tripController = require('../controllers/trip.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');


api.get('/testTrip', tripController.prueba),

api.post('/addTrip',mdAuth.ensureAuth,tripController.addTrip);

module.exports = api;