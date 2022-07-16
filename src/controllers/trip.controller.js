'use strict'

const Trip = require('../models/trip.model');
const { validateData, searchTrip, checkUpdate } = require('../utils/validate');
const jwt = require('../services/jwt');

exports.prueba = async (req, res) => {
    await res.send({ message: 'Controlador de trip corriendo' })
}

exports.addTrip = async (req, res) => {
    try {

        const params = req.body;
        const data = {
            name: params.name,
            endDate: params.endDate,
            user: req.user.sub
        };
        const msg = validateData(data);
        if (msg) {
            return res.status(400).send(msg);
        } else {
            const alreadyTrip = await searchTrip(params.name);
            if (alreadyTrip) {
                return res.send({ message: 'Ya existe un viaje con este nombre' });
            } else {
                const trip = new Trip(data);
                await trip.save();
                return res.send({ message: 'viaje creado satisfactoriamente', trip });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error creando el viaje' });
    }
}

exports.updateTrip = async (req, res) => {
    try {
        const tripId = req.params.id;
        const params = req.body;
        const validateUpdate = await checkUpdate(params);
        if (validateUpdate === false) return res.status(400).send({ message: 'No se pueden actualizó o no hay parámetros válidos' })
        const checkExist = await Trip.findOne({ _id: tripId }).lean();
        if (!checkExist) {
            return res.status(400).send({ message: 'No se ha encontrado este viaje' });
        } else {
            const tripExist = await searchTrip(params.name);
            if (tripExist) {
                return res.send({ message: 'ya existe un viaje con este nombre' });
            } else {
                const updatedTrip = await Trip.findOneAndUpdate({ _id: tripId }, params, { new: true });
                if (!updatedTrip) {
                    return res.status(400).send({ message: 'No se ha podido actualizar el viaje' });
                } else {
                    return res.send({ message: 'Viaje actualizado', updatedTrip });
                }
            }
        }
    } catch (err) {
        console.log.err;
        return res.status(500).send({ err, message: 'Error actualizando viajes' });
    }
}

exports.deleteTrip = async (req, res) => {
    try {
        const tripId = req.params.id;

        const tripDeleted = await Trip.findOneAndDelete({ _id: tripId });
        if (!tripDeleted) {
            return res.status(404).send({ message: 'El viaje ya se ha eliminado o no existe' });
        } else {
            return res.send({ message: 'Viaje eliminado', tripDeleted })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error eliminando el viaje' });
    }
}

exports.getTripsOnlyAdmin = async (req, res) => {
    try {
        const findTrips = await Trip.find().populate('user').lean();
        if (findTrips.length == 0) {
            return res.status(400).send({ message: 'No se han encontrado los viajes' });
        } else {
            return res.send({ message: 'Viajes encontradas:', findTrips })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo los viajes' });
    }
}

exports.getTrip_OnlyAdmin = async (req, res) => {
    try {
        const tripId = req.params.id;
        const trip = await Trip.findOne({ _id: tripId }).populate('user').lean();
        if (!trip) {
            return res.status(400).send({ message: 'Viaje no encontrado' });
        } else {
            return res.send({ message: 'Viaje encontrado encontrado:', trip });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el viaje' });
    }
}

// Funciones de Administrador
exports.getTripsOnlyClient = async (req, res) => {
    try {
        const findTrips = await Trip.find({}).lean();
        if (findTrips.length == 0) {
            return res.status(400).send({ message: 'No se han encontrado los viajes' });
        } else {
            return res.send({ message: 'Viajes encontradas:', findTrips })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo los viajes' });
    }
}

exports.getTrip_OnlyClient = async (req, res) => {
    try {
        const tripId = req.params.id;
        const trip = await Trip.findOne({ _id: tripId }).lean();
        if (!trip) {
            return res.status(400).send({ message: 'Viaje no encontrado' });
        } else {
            return res.send({ message: 'Viaje encontrado encontrado:', trip });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el viaje' });
    }
}