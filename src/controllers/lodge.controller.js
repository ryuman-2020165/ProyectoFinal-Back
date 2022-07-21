'use strict'

const Lodge = require('../models/lodge.model');
const User = require('../models/user.model');
const Department = require('../models/department.model');
const Category = require('../models/category.model');
const { validateData, searchLodge, checkDeleteLodge, checkUpdate, validateExtension } = require('../utils/validate');
const fs = require('fs');
const path = require('path');

exports.testLodge = (req, res) => {
    return res.send({ message: 'Mensaje de Lodge funcionando correctamente' });
}

//* Funciones de administrador ---------------------------------------------------------------------------------------

exports.addLodge = async (req, res) => {
    try {

        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
            price: params.price,
            popularity: params.popularity,
            department: req.params.idDepartment,
            category: req.params.idCategory,
            user: req.user.sub
        }
        const msg = validateData(data);
        if (!msg) {
            const userExist = await User.findOne({ _id: data.user });
            if (!userExist) {
                return res.status(400).send({ message: 'Usuario no encontrado' });
            } else {
                const departmentExist = await Department.findOne({ _id: data.department });
                if (!departmentExist) {
                    return res.status(400).send({ message: 'Departamento no encontrado' });
                } else {
                    const categoryExist = await Category.findOne({ _id: data.category });
                    if (!categoryExist) {
                        return res.status(400).send({ message: 'Categoria no encontrada' });
                    } else {
                        const lodgeExist = await searchLodge(params.name);
                        if (lodgeExist) {
                            return res.send({ message: 'Ya existe un hospedaje con este nombre' });
                        } else {
                            const lodge = new Lodge(data);
                            await lodge.save();
                            return res.send({ message: 'Hospedaje creado satisfactoriamente', lodge });
                        }
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error creando lodge' });
    }
}

exports.getLodges_OnlyAdmin = async (req, res) => {
    try {
        const lodges = await Lodge.find().populate('user').populate('department').populate('category');
        if (!lodges) {
            return res.status(400).send({ message: 'Hospedajes no encontrados' });
        } else {
            return res.send({ messsage: 'Hospedajes encontrados:', lodges });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo estos hospedajes' });
    }
}

exports.getLodge_OnlyAdmin = async (req, res) => {
    try {
        const lodgeId = req.params.id;
        const lodge = await Lodge.findOne({ _id: lodgeId }).populate('user').lean();
        if (!lodge) {
            return res.status(400).send({ message: 'Hospedaje no encontrado' });
        } else {
            return res.send({ message: 'Hospedaje encontrado:', lodge });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el hospedaje' });
    }
}

exports.updateLodge_OnlyAdmin = async (req, res) => {
    try {
        const lodgeId = req.params.id;
        const params = req.body;
        const validateUpdate = await checkUpdate(params);
        if (validateUpdate === false) return res.status(400).send({ message: 'No se puede actualizar o hay parámetros válidos' })
        const checkLodgeExist = await Lodge.findOne({ _id: lodgeId }).lean();
        if (!checkLodgeExist) {
            return res.status(400).send({ message: 'No se ha encontrado el hospedaje' });
        } else {
            const lodgeExist = await searchLodge(params.name);
            if (lodgeExist) {
               // return res.send({ message: 'Ya existe un lodge con el mismo nombre' });
               delete params.name
               const updateLodge = await Lodge.findOneAndUpdate({ _id: lodgeId }, params, { new: true }).populate('department')
                if (!updateLodge) {
                    return res.status(400).send({ message: 'No se ha podido actualizar el hospedaje' })
                } else {
                    return res.send({ message: 'Lodge Actualizado, nombre en uso', updateLodge })
                }
            } else {
                const updateLodge = await Lodge.findOneAndUpdate({ _id: lodgeId }, params, { new: true }).populate('department')
                if (!updateLodge) {
                    return res.status(400).send({ message: 'No se ha podido actualizar el hospedaje' })
                } else {
                    return res.send({ message: 'Lodge Actualizado', updateLodge })
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error actualizando el lodge' })
    }
}

exports.deleteLodge_OnlyAdmin = async (req, res) => {
    try {
        const lodgeId = req.params.id;
        const deleteLodge = await Lodge.findOneAndDelete({ _id: lodgeId });
        if (!deleteLodge) {
            return res.status(404).send({ message: 'El hospedaje no se ha econtrado o ya fue eliminado' });
        } else {
            return res.send({ message: 'Hospedaje eliminado', deleteLodge })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error eliminando el hospedaje' });
    }
}

//* Funciones de usuario registrado ---------------------------------------------------------------------------------------

exports.getLodges_OnlyClient = async (req, res) => {
    try {
        const lodges = await Lodge.find()
        if (!lodges) {
            return res.status(400).send({ message: 'Hospedajes no encontrados' });
        } else {
            return res.send({ messsage: 'Hospedajes encontrados:', lodges });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo estos hospedajes' });
    }
}

exports.getLodge_OnlyClient = async (req, res) => {
    try {
        const lodgeId = req.params.id;
        const lodge = await Lodge.findOne({ _id: lodgeId }).lean();
        if (!lodge) {
            return res.status(400).send({ message: 'Hospedaje no encontrado' });
        } else {
            return res.send({ message: 'Hospedaje encontrado:', lodge });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el hospedaje' });
    }
}


// ---------------------------------Agregar imagen--------------------------------------------


exports.uploadImageLodge = async (req, res) => {
    try {
        const lodgeId = req.params.id;
        const userId = req.user.sub;

        const checkAdminLodge = await Lodge.findOne({ _id: lodgeId })
        if (checkAdminLodge.user != userId) {
            return res.status(400).send({ message: 'No puedes subir una imagen a este hospedaje' })
        } else {
            const alreadyImage = await Lodge.findOne({ _id: lodgeId });
            let pathFile = './uploads/lodges/';

            if (alreadyImage.image) {
                fs.unlinkSync(pathFile + alreadyImage.image);
            }

            if (!req.files.image || !req.files.image.type) {
                return res.status(400).send({ message: 'No se ha enviado una imagen' });
            } else {
                //ruta en la que llega la imagen
                const filePath = req.files.image.path; // \uploads\users\file_name.ext

                //separar en jerarquía la ruta de la imágen (linux o MAC: ('\'))
                const fileSplit = filePath.split('\\');// fileSplit = ['uploads', 'users', 'file_name.ext']
                const fileName = fileSplit[2];// fileName = file_name.ext

                const extension = fileName.split('\.'); // extension = ['file_name', 'ext']
                const fileExt = extension[1]; // fileExt = ext;

                const validExt = await validateExtension(fileExt, filePath);

                if (validExt === false) {
                    return res.status(400).send({ message: 'Extensión inválida' });
                } else {
                    const updateLodge = await Lodge.findOneAndUpdate({ _id: lodgeId }, { image: fileName }, { new: true });
                    if (!updateLodge) {
                        return res.status(404).send({ message: 'Hospedaje no encontrado' });
                    } else {
                        return res.status(200).send({ message: 'Imagen añadida', updateLodge });
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error subiendo imagen' });
    }
}

exports.getImageLodge = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const pathFile = './uploads/lodges/' + fileName;

        const image = fs.existsSync(pathFile);
        if (!image) {
            return res.status(404).send({ message: 'Imagen no encontrada' });
        } else {
            return res.sendFile(path.resolve(pathFile));
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo la imagen' });
    }
}

