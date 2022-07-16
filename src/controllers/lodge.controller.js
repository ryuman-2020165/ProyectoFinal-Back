'use strict'

const Lodge = require('../models/lodge.model');
const User = require('../models/user.model');
const Department = require('../models/department.model');
const Category = require('../models/category.model');
const { validateData, searchLodge, checkDeleteLodge, checkUpdate } = require('../utils/validate');

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
        const lodges = await Lodge.find().populate('user');
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
                return res.send({ message: 'Ya existe un lodge con el mismo nombre' });
            } else {
                const updateLodge = await Lodge.findOneAndUpdate({ _id: lodgeId }, params, { new: true })
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