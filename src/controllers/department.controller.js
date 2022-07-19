
'use strict'

const Department = require('../models/department.model');
const { validateData, searchDepartment, checkUpdate, validateExtension } = require('../utils/validate');
const fs = require('fs');
const path = require('path');

exports.testDepartment = (req, res) => {
    return res.send({ message: 'Mensaje de departamento funcionando correctamente' });
}

//* Funciones de administrador ---------------------------------------------------------------------------------------

exports.saveDepartment = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description
        };
        const msg = validateData(data);
        if (msg) {
            return res.status(400).send(msg);
        } else {
            const departmentExist = await searchDepartment(params.name);
            if (departmentExist) {
                return res.send({ message: 'Ya existe un departamento con el mismo nombre' });
            } else {
                const department = new Department(data);
                await department.save();
                return res.send({ message: 'Departamento creado satisfactoriamente' });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error guardando el departamento' });
    }
}

exports.updateDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const params = req.body;
        const validateUpdate = await checkUpdate(params);
        if (validateUpdate === false) {
            return res.status(400).send({ message: 'No se pueden actualizar o no hay parámetros válidos' })
        } else {
            const checkExist = await Department.findOne({ _id: departmentId }).lean()
            if (!checkExist) {
                return res.status(400).send({ message: 'No se ha encontrado el departamento' });
            } else {
                const departmentExist = await searchDepartment(params.name);
                if (departmentExist) {
                    return res.send({ message: 'Ya existe un departamento con el mismo nombre' });
                } else {
                    const updatedDepartment = await Department.findOneAndUpdate({ _id: departmentId }, params, { new: true })
                    if (!updatedDepartment) {
                        return res.status(400).send({ message: 'No se ha podido actualizar el departamento' });
                    } else {
                        return res.send({ message: 'Departamento actualizado', updatedDepartment })
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error actualizando el departamento' });
    }
}

exports.deleteDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;

        const departmentDeleted = await Department.findOneAndDelete({ _id: departmentId });
        if (!departmentDeleted) {
            return res.status(404).send({ message: 'El departamento ya se ha eliminado o no existe' });
        } else {
            return res.send({ message: 'Departamento eliminado', departmentDeleted })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error eliminando el departamento' });
    }
}

exports.getDepartments = async (req, res) => {
    try {
        const findDepartment = await Department.find({}).lean()
        if (findDepartment.length == 0) {
            return res.status(400).send({ message: 'No se han encontrado los departamentos' });
        } else {
            return res.send({ message: 'Categorias encontradas:', findDepartment })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo los departamentos' });
    }
}

exports.getDepartmentById = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const findDepartment = await Department.findOne({ _id: departmentId }).lean()
        if (findDepartment.length == 0) {
            return res.status(400).send({ message: 'No se ha encontrado el departamento' });
        } else {
            return res.send({ message: 'Departamento encontrado:', findDepartment })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo el departamento' });
    }
}

//Función para añadir imágen
exports.uploadImageDepartament = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const alreadyImage = await Department.findOne({ _id: departmentId });
        let pathFile = './uploads/departments';

        if (alreadyImage.image) {
            fs.unlinkSync(pathFile + alreadyImage.image);
        }

        if (!req.files.image || !req.files.image.type) {
            return res.status(400).send({ message: 'no se ha enviado una imágen' })

        } else {
            const filePath = req.files.image.path;
            const fileSplit = filePath.split('\\');// fileSplit = ['uploads', 'users', 'file_name.ext']
            const fileName = fileSplit[2];

            const extension = fileName.split('\.');
            const fileExt = extension[1];

            const validExt = await validateExtension(fileExt, filePath)
            if (validExt === false) {
                return res.status(400).send({ message: 'Extensión inválida' });
            } else {
                const updatedDepartment = await Department.findOneAndUpdate({ _id: departmentId }, { image: fileName }, { new: true });
                if (!updatedDepartment) {
                    return res.status(404).send({ message: 'Departamento no encontrado' })
                } else {
                    return res.status(200).send({ message: 'Imágen añadida', updatedDepartment })
                }
            }

        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error subiendo imágen' })
    }
}

exports.getImageDepartment = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const pathFile = './uploads/departments' + fileName;

        const image = fs.existsSync(pathFile);
        if (!image) {
            return res.status(404).send({ message: 'Imagen no encontrada' })
        } else {
            return res.sendFile(path.resolve(pathFile))
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo la imágen' })
    }
}