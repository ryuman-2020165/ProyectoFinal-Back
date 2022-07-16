'use strict'

const Destiny = require('../models/destiny.model');
const Trip = require('../models/trip.model');
const Lodge = require('../models/lodge.model');
const {validateData, searchDestiny} = require('../utils/validate');

exports.test =  (req, res)=>{
    return res.send({message:'Destino funcionando correctamente'});
}

exports.addDestiny = async(req,res)=>{
    try{
        const params = req.body;
        const data = {
            startDate: params.startDate,
            endDate: params.endDate,
            trip: req.params.idTrip,
            lodge: req.params.idLodge
        }
        const msg = validateData(data);
        if(!msg){
            const tripExist = await Trip.findOne({_id: data.trip});
            if(!tripExist){
                return res.status(400).send({message:'Viaje no encontrado'});
            }else{
                const lodgeExist = await Lodge.findOne({_id: data.lodge});
                if(!lodgeExist){
                    return res.status(400).send({message:'Hospedaje no encontrado'});
                }else{
                        const destiny = new Destiny(data);
                        await destiny.save();
                        return res.send({message:'Destino creado satisfactoriamente', destiny})
                    
                }
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message:'Error creando Destino'});
    }
}

exports.deleteDestiny_OnlyAdmin = async(req,res)=>{
    try {
        const destinyId = req.params.id;
        const deleteDestiny = await Destiny.findOneAndDelete({_id: destinyId});
        if (!deleteDestiny) {
            return res.status(404).send({ message: 'El destino no se ha econtrado o ya fue eliminado' });
        } else {
            return res.send({ message: 'Destino eliminado', deleteDestiny })   
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send({err, message: 'Error eliminando el destino'});
    }
}

exports.getDestinys_OnlyAdmin = async (req, res) => {
    try {
        const destinys = await Destiny.find().populate('trip').lean();
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
        const destiny = await Destiny.findOne({ _id: destinyId }).populate('trip').lean();
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