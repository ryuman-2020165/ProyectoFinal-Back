'use strict'

const Destiny = require('../models/destiny.model');
const Trip = require('../models/trip.model');
const Lodge = require('../models/lodge.model');
const User = require('../models/user.model');
const { validateData, searchDestiny, checkUpdate } = require('../utils/validate');

exports.test = (req, res) => {
    return res.send({ message: 'Destino funcionando correctamente' });
}

//* Funciones de administrador -------------------------------------------------------------

exports.addDestiny = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        const data = {
            startDate: params.startDate,
            endDate: params.endDate,
            trip: req.params.idTrip,
            lodge: req.params.idLodge,
            user: req.user.sub
        }
        const msg = validateData(data);
        if (!msg) {
            const userExist = await User.findOne({ _id: userId });
            if (!userExist) {
                return res.status(400).send({ message: 'Usuario no encontrado' });
            } else {
                const tripExist = await Trip.findOne({ _id: data.trip });
                if (!tripExist) {
                    return res.status(400).send({ message: 'Viaje no encontrado' });
                } else {
                    const lodgeExist = await Lodge.findOne({ _id: data.lodge });
                    if (!lodgeExist) {
                        return res.status(400).send({ message: 'Hospedaje no encontrado' });
                    } else {
                        let date1 = new Date(data.startDate);
                        let date2 = new Date(data.endDate);
                        if (date1 == 'Invalid Date' || date2 == 'Invalid Date') {
                            return res.status(400).send({ message: 'Las fechas no son válidas' })
                        } else {
                            let today = new Date().toISOString().split("T")[0]
                            today = new Date(today)
                            let differenceToday = date1.getTime() - today.getTime()
                            if (differenceToday < 0) {
                                return res.status(400).send({ message: 'Ingresa una fecha de incio superior' })
                            } else {
                                let difference = date2.getTime() - date1.getTime();
                                if (difference < 0) {
                                    return res.status(400).send({ message: 'Ingrea una fecha de salida superior a la de inicio' })
                                } else {
                                    if (difference == 0) {
                                        return res.status(400).send({ message: 'No puedes establecer la mismas fechas' })
                                    } else {
                                        const destiny = new Destiny(data);
                                        await destiny.save();
                                        return res.send({ message: 'Destino creado satisfactoriamente', destiny })
                                    }
                                }
                            }
                        }
                    }
                }
            }

        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error creando Destino' });
    }
} 

exports.deleteDestiny_OnlyAdmin = async (req, res) => {
    try {
        const destinyId = req.params.id;
        const deleteDestiny = await Destiny.findOneAndDelete({ _id: destinyId });
        if (!deleteDestiny) {
            return res.status(404).send({ message: 'El destino no se ha econtrado o ya fue eliminado' });
        } else {
            return res.send({ message: 'Destino eliminado', deleteDestiny })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error eliminando el destino' });
    }
}

exports.updateDestiny_OnlyAdmin = async (req, res) => {
    try {
        const destinyId = req.params.id;
        const params = req.body;
        const validateUpdate = await checkUpdate(params);
        if (validateUpdate === false) return res.status(400).send({ message: 'No se pueden actualizó o no hay parámetros válidos' })
        const checkDestinyExist = await Destiny.findOne({ _id: destinyId }).lean();
        if (!checkDestinyExist) {
            return res.status(400).send({ message: 'No se ha encontrado el destino' });
        } else {
            const updateDestiny = await Destiny.findOneAndUpdate({ _id: destinyId }, params, { new: true })
            if (!updateDestiny) {
                return res.status(400).send({ message: 'No se ha podido actualizar el destino' })
            } else {
                return res.send({ message: 'Destino actualizado', updateDestiny })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error actaulizando el destino' })
    }
}

exports.deleteDestiny_OnlyClient = async (req, res) => {
    try {
        const destinyId = req.params.id;
        const deleteDestiny = await Destiny.findOneAndDelete({ _id: destinyId });
        if (!deleteDestiny) {
            return res.status(404).send({ message: 'El destino no se ha econtrado o ya fue eliminado' });
        } else {
            return res.send({ message: 'Destino eliminado', deleteDestiny })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error eliminando el destino' });
    }
}

exports.updateDestiny_OnlyClient = async (req, res) => {
    try {
        const destinyId = req.params.id;
        const params = req.body;
        const validateUpdate = await checkUpdate(params);
        if (validateUpdate === false) return res.status(400).send({ message: 'No se pueden actualizó o no hay parámetros válidos' })
        const checkDestinyExist = await Destiny.findOne({ _id: destinyId }).lean();
        if (!checkDestinyExist) {
            return res.status(400).send({ message: 'No se ha encontrado el destino' });
        } else {
            const updateDestiny = await Destiny.findOneAndUpdate({ _id: destinyId }, params, { new: true })
            if (!updateDestiny) {
                return res.status(400).send({ message: 'No se ha podido actualizar el destino' })
            } else {
                return res.send({ message: 'Destino actualizado', updateDestiny })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error actaulizando el destino' })
    }
} 

exports.getDestinys_OnlyAdmin = async (req, res) => {
    try {
        const destinys = await Destiny.find().populate('trip').populate('lodge').lean();
        if (!destinys) {
            return res.status(400).send({ message: 'Destinos no encontrados' });
        } else {
            return res.send({ messsage: 'Destinos encontrados:', destinys });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo estos destinos' });
    }
}

exports.getDestinys_OnlyClient = async (req, res) => {
    try {
        const destinys = await Destiny.find().populate('trip').populate('lodge').lean();
        if (!destinys) {
            return res.status(400).send({ message: 'Destinos no encontrados' });
        } else {
            return res.send({ messsage: 'Destinos encontrados:', destinys });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo estos destinos' });
    }
}

exports.getDestiny_OnlyAdmin = async (req, res) => {
    try {
        const destinyId = req.params.id;
        const destiny = await Destiny.findOne({ _id: destinyId }).populate('trip');
        if (!destiny) {
            return res.status(400).send({ message: 'Destino no encontrado' });
        } else {
            return res.send({ message: 'Destino encontrado:', destiny });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el destino' });
    }
}

//* Funciones de usuario registrado ---------------------------------------------------------------------------------------

exports.getDestiny_OnlyClient = async (req, res) => {
    try {
        const destinyId = req.params.id;
        const destiny = await Destiny.findOne({ _id: destinyId }).lean();
        if (!destiny) {
            return res.status(400).send({ message: 'Destino no encontrado' });
        } else {
            return res.send({ message: 'Destino encontrado:', destiny });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el destino' });
    }
}

exports.myDestiny = async (req, res) => {
    try {
        const userId = req.user.sub
        const myDestiny = await Destiny.find({ user: userId }).lean()
        if (myDestiny.length === 0) {
            return res.send({ message: 'No hay ningún destino para mostrar' })
        } else {
            return res.send({ myDestiny })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el destino' });
    }
}