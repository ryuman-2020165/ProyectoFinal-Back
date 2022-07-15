'use strict'

const Trip = require('../models/trip.model');
const {validateData, searchTrip} = require('../utils/validate');
const jwt = require('../services/jwt');

exports.prueba = async (req, res)=>{
    await res.send({message: 'Controlador de trip corriendo'})
}

exports.addTrip = async (req,res)=>{
    try{

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'error registrando usuario'});
    }
}


exports.addTrip = async(req, res)=>{
    try{

        const params = req.body;
        const data = {
            name: params.name,
            endDate: params.endDate,
            user: req.user.sub
        };
        const msg = validateData(data);
        if(msg){
            return res.status(400).send(msg);
        } else{
            const alreadyTrip = await searchTrip(params.name);
         if(alreadyTrip){
            return res.send({message: 'Ya existe un viaje con este nombre'});
        } else{
            const trip = new Trip(data);
            await trip.save();
            return res.send({message: 'viaje creado satisfactoriamente', trip});
        }
    }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error creando el viaje'});
    }
}
