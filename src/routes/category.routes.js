'use strict'

const express = require('express');
const categoryController = require('../controllers/category.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated')

// Funcion de Admin
api.get('/test',[mdAuth.ensureAuth,mdAuth.isAdmin],categoryController.test);
api.post('/addCategory',[mdAuth.ensureAuth, mdAuth.isAdmin],categoryController.saveCategory);
api.put('/updateCategory/:id',[mdAuth.ensureAuth,mdAuth.isAdmin], categoryController.updateCategory);
api.delete('/deleteCategory/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],categoryController.deleteCategory);

//Funcion de Clientes
api.get('/getCategorys',categoryController.getCategorys);
api.get('/getCategory/:id',categoryController.getCategoryById);

module.exports = api;