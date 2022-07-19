'use strict'

const express = require('express');
const api = express.Router();
const departmentController = require('../controllers/department.controller');
const mdAuth = require('../services/authenticated');

const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/departments' });

api.get('/test', departmentController.testDepartment);
api.post('/saveDepartment', [mdAuth.ensureAuth, mdAuth.isAdmin], departmentController.saveDepartment);
api.put('/updateDepartment/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], departmentController.updateDepartment);
api.delete('/deleteDepartment/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], departmentController.deleteDepartment);
api.get('/getDepartments', departmentController.getDepartments);
api.get('/getDepartment/:id', departmentController.getDepartmentById);

//Cargar imágenes
api.post('/uploadImageDepartment/:id', [mdAuth.ensureAuth, mdAuth.isAdmin, upload], departmentController.uploadImageDepartament);
api.get('/getImageDepartment/:fileName', [mdAuth.ensureAuth, mdAuth.isAdmin, upload], departmentController.getImageDepartment);


module.exports = api;