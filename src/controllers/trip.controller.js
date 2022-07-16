'use strict'

const Trip = require('../models/trip.model');
const {validateData, searchTrip, checkUpdate} = require('../utils/validate');
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


exports.getTrip = async(req, res)=>{  
    try {
        const tripId = req.params.id; 
        const trip = await Trip.findOne({_id: tripId}); 
        if (!trip) {
            return res.send({message: 'trip not found'}); 
        } else {
            return res.send({trip}); 
        }
    } catch (error) {
        console.log(error) 
        return error;
    }
    
} 


exports.updateTrip = async(req, res)=>{ 
    try {
        const params = req.body; 
        const tripId = req.params.id; 
        const check = await checkUpdate(params); 
        if (check === false) {
            return res.status(400).send({message: 'Data not received'}); 
        } else {
            const updateTrip = await Trip.findOneAndUpdate({_id: tripId}, params, {new: true}); 
            if (!updateTrip) {
                return res.send({message: 'Trip not found'});
            } else {
                return res.send({message: 'Update succesfully', updateTrip});  
            }
        }
    } catch (error) {
        console.log(error) 
        return error;
    }
} 


exports.deleteTrip = async (req, res)=>{ 
    try {
        const tripId = req.params.id; 
        const tripDelete = await Trip.findOneAndDelete({_id: tripId}); 
        if (!tripDelete) {
            return res.status(500).send({message: 'Trip not found or already delete'});
        } else {
            return res.send({tripDelete, message: 'Trip delete succesfully'});
        }
    } catch (error) {
        console.log(error) 
        return error;
    }
}
