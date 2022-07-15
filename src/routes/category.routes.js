'use strict'

const express = require('express');
const categoryController = require('../controllers/category.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated')

//FUNCIÓN PÚBLICA
api.get('/test',[mdAuth.ensureAuth,mdAuth.isAdmin],categoryController.test);
api.post('/addCategory',[mdAuth.ensureAuth, mdAuth.isAdmin],categoryController.saveCategory);
api.put('/updateCategory/:id',[mdAuth.ensureAuth,mdAuth.isAdmin], categoryController.updateCategory);
api.delete('/deleteCategory/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],categoryController.deleteCategory);
api.get('/getCategorys',[mdAuth.ensureAuth],categoryController.getCategorys);
api.get('/getCategory/:id',[mdAuth.ensureAuth],categoryController.getCategoryById);

module.exports = api;