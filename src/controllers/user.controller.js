'use strict'

const User = require('../models/user.model');
const {validateData, encrypt, alreadyUser, checkPassword, checkUpdate, checkPermission,checkUpdateAdmin} = require('../utils/validate');
const jwt = require('../services/jwt');

exports.prueba = async (req, res)=>{
    await res.send({message: 'Controller run'})
}

exports.register = async(req, res)=>{
    try{
        const params = req.body;
        let data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: 'CLIENT'
        };
        let msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        let already = await alreadyUser(data.username);
        if(already) return res.status(400).send({message: 'use otro usuario'});
        data.surname = params.surname;
        data.phone = params.phone;
        data.nit = params.nit;
        data.password = await encrypt(params.password);

        let user = new User(data);
        await user.save();
        return res.send({message: 'usuario creado correctamente'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'error registrando usuario'});
    }
}

exports.login = async(req, res)=>{
    try{
        const params = req.body;
        let data = {
            username: params.username,
            password: params.password
        }
        let msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        let already = await alreadyUser(params.username);
        if(already && await checkPassword(data.password, already.password)){
            let token = await jwt.createToken(already);
            delete already.password;

            return res.send({token, message: 'Login exitoso', already});
        }else return res.status(401).send({message: 'credenciales invalidas'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error loguenado usuario'});
    }
}

//Fuciones de usuario logueado

exports.update = async(req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;

        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'Tu no puedes actualizar este usuario'});
        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.send({message: 'Usuario no encontrado'});
        const validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'no se puede actualizar o los parametros son invalidos'});
        let alreadyname = await alreadyUser(params.username);
        if(alreadyname && userExist.username != params.username) return res.send({message: 'nombre de usuario en uso'});
        const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new: true}).lean();
        if(userUpdate) return res.send({message: 'usuario actualizado exitosamente', userUpdate});
        return res.send({message: 'usuario no actualizado'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error actualizando usuario'});
    }
}

exports.delete = async(req, res)=>{
    try{
        const userId = req.params.id;
        const persmission = await checkPermission(userId, req.user.sub);
        if(persmission === false) return res.status(403).send({message: 'No tienes permitido actualizar este usuario'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(userDeleted) return res.send({message: 'cuenta eliminada', userDeleted});
        return res.send({message: 'usuario no encontrado o ya eliminado'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'error eliminando usuario'});
    }
}

//FUNCIONES PRIVADAS
//ADMIN

exports.saveUser = async(req, res)=>{
    try{

        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: params.role
        };
        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const userExist = await alreadyUser(params.username);
        if(userExist) return res.send({message: 'nombre de usuario en uso'});
        if(params.role != 'ADMIN' && params.role != 'CLIENT') return res.status(400).send({message: 'Rol invalido'});
        data.surname = params.surname;
        data.phone = params.phoe;
        data.password = await encrypt(params.password);

        const user = new User(data);
        await user.save();
        return res.send({message: 'Usuario guardado exitosamente'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'error guardando usuario'});
    }
}

exports.updateUser = async(req, res)=>{
    try{
         
        const userId = req.params.id;
        const params = req.body;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.send({message: 'usuario no encontrado'});
        const emptyParams = await checkUpdateAdmin(params);
        if(emptyParams === false) return res.status(400).send({message: 'paramentros vacios'});
        if(userExist.role === 'ADMIN') return res.send({message: 'usuario con rol admin no puede actualizar'});
        const alreadyUsername = await alreadyUser(params.username);
        if(alreadyUsername && userExist.username != alreadyUsername.username) return res.send({message: 'usuario ya usado'});
        if(params.role != 'ADMIN' && params.role != 'CLIENT') return res.status(400).send({message: 'rol invalido'});
        const userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new: true});
        if(!userUpdated) return res.send({message: ' usuario no actualizado'});
        return res.send({message: 'User updated successfully', username: userUpdated.username});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'error actualizando usuario'});
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        
        const userId = req.params.id;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.send({message: 'usuario no econtrado'});
        if(userExist.role === 'ADMIN') return res.send({message: ' No se puede eliminar un usuario con rol de administrador'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(!userDeleted) return res.send({message: 'Usuario no eliminado'});
        return res.send({message: 'cuenta eliminada exitosamente', userDeleted})
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'error eliminando cuenta'});
    }
}