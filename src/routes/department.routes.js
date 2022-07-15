'use strict'

const express = require('express');
const api = express.Router();
const departmentController = require('../controllers/department.controller');
const mdAuth = require('../services/authenticated');

api.get('/test', departmentController.testDepartment);
api.post('/saveDepartment', [mdAuth.ensureAuth,mdAuth.isAdmin], departmentController.saveDepartment);
api.put('/updateDepartment/:id',[mdAuth.ensureAuth,mdAuth.isAdmin], departmentController.updateDepartment);
api.delete('/deleteDepartment/:id',[mdAuth.ensureAuth,mdAuth.isAdmin], departmentController.deleteDepartment);
api.get('/getDepartments', departmentController.getDepartments);
api.get('/getDepartment/:id', departmentController.getDepartmentById);
module.exports = api;