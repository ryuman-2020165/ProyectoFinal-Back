'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Department = require('../models/department.model'); 
const Trip = require('../models/trip.model');
const Lodge = require('../models/lodge.model');
const Destiny = require('../models/destiny.model');

exports.validateData = (data) =>{
    let keys = Object.keys(data), msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `The params ${key} es obligatorio\n`
    }
    return msg.trim();
}

exports.alreadyUser = async (username)=>{
   try{
    let exist = User.findOne({username:username}).lean()
    return exist;
   }catch(err){
       return err;
   }
}

exports.encrypt = async (password) => {
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPermission = async (userId, sub)=>{
    try{
        if(userId != sub){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (user)=>{
    if(user.password || 
       Object.entries(user).length === 0 || 
       user.role){
        return false;
    }else{
        return true;
    }
}

exports.checkUpdateAdmin = async(user)=>{
    if(user.password ||
       Object.entries(user).length === 0){
        return false;
    }else{
        return true;
    }
}

exports.searchCategory = async(name)=>{
    try{
        const category = await Category.findOne({name: name});
        if(!category) return false
        return category;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdateProduct = async(product)=>{
    if( product.sales ||
        Object.entries(product).length === 0){
          return false;
      }else{
          return true;
      }
}

exports.findUser = async (username) => {
    try {
        let exist = await User.findOne({ username: username }).lean();
        return exist;
    } catch (err) {
        console.log(err);
        return err;
    }
}



exports.searchCategory = async(name)=>{
    try{
        const category = await Category.findOne({name: name});
        if(!category) return false
        return category;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchDepartment = async(name)=>{
    try{
        const department = await Department.findOne({name: name});
        if(!department) return false
        return department;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchTrip = async(name)=>{
    try{
        const trip = await Trip.findOne({name: name});
        if(!trip) return false
        return trip;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchLodge = async(name)=>{
    try{
        const lodge = await Lodge.findOne({name: name});
        if(!lodge) return false
        return lodge;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchDestiny = async(name)=>{
    try{
        const destiny = await Destiny.findOne({name: name});
        if(!destiny) return false
        return destiny;
    }catch(err){
        console.log(err);
        return err;
    }
}