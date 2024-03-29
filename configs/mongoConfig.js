'use strict'

const mongoose = require('mongoose');

exports.init = () => {
    const uriMongo = 'mongodb+srv://flopez:123@intravel.rptmg.mongodb.net/?retryWrites=true&w=majority';
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', () => {
        console.log('MongoDB | No fue posible conectarse a la base de datos');
        mongoose.disconnect();
    });
    mongoose.connection.on('connecting', () => {
        console.log('MongoDB | Estableciendo conexión...');
    });
    mongoose.connection.on('connected', () => {
        console.log('MongoDB | Conexión establecida a MongoDB');
    });
    mongoose.connection.once('open', () => {
        console.log('MongoDB | Conexión establecida a la base de datos: ' + uriMongo);
    });
    mongoose.connection.on('reconnected', () => {
        console.log('MongoDB | Reconectado a MongoDB');
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB | Desconectado de MongoDB');
    });

    mongoose.connect(uriMongo, {
        maxPoolSize: 50,
        useNewUrlParser: true
    }).catch(err => console.log(err));
}