'use strict'

const Category = require('../models/category.model');
const {validateData, searchCategory} = require('../utils/validate');

exports.test = async(req,res)=>{
return res.send({message:'Test de categoria corriendo'})
}

exports.saveCategory = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description
        };
        const msg = validateData(data);
        if(msg){ 
            return res.status(400).send(msg);
        }else{
            const categoryExist = await searchCategory(params.name);
            if (categoryExist) {
                return res.send({message: 'Ya existe una categoria con el mismo nombre'});
            } else {
                const category = new Category(data);
                await category.save();
                return res.send({message: 'Categoria creada satisfactoriamente'});
            }
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error guardando la categoria'});
    }
}


exports.updateCategory = async(req,res)=>{
    try {
        const categoryId = req.params.id;
        const params = req.body;
        const checkExist = await Category.findOne({_id: categoryId}).lean()
        if (!checkExist) {
            return res.status(400).send({ message: 'No se ha encontrado una categoria'});
        } else {
            const categoryExist = await searchCategory(params.name);
            if (categoryExist) {
                return res.send({message: 'Ya existe una categoria con el mismo nombre'});
            } else {
                const updatedCategory = await Category.findOneAndUpdate({_id: categoryId}, params, {new: true})
                if (!updatedCategory) {
                    return res.status(400).send({ message: 'No se ha podido actualizar la categoria' });
                } else {
                    return res.send({ message: 'Categoria actualizada', updatedCategory })
            }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({err, message: 'Error atualizando la categoria'});
    }
}

exports.deleteCategory = async(req,res)=>{
    try {
        const categoryId = req.params.id;
  
        const categoryDeleted = await Category.findOneAndDelete({_id: categoryId});
        if (!categoryDeleted) {
            return res.status(404).send({ message: 'La categoria ya se ha eliminado o no existe' });
        } else {
            return res.send({ message: 'Categoria eliminada', categoryDeleted })   
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send({err, message: 'Error eliminando la categoria'});
    }
}

exports.getCategorys = async(req,res)=>{
    try {
        const findCategory = await Category.find({}).lean()
        if (findCategory.length == 0) {
            return res.status(400).send({ message: 'No se ha encontrado categorias'});
        } else {
            return res.send({ message: 'Categorias encontradas:', findCategory })   
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({err, message: 'Error obteniendo la categoria'});
    }
}


exports.getCategoryById = async(req,res)=>{
    try {
        const categoryId = req.params.id;
        const findCategory = await Category.find({_id: categoryId}).lean()
        if (findCategory.length == 0) {
            return res.status(400).send({ message: 'No se ha encontrado la categoria'});
        } else {
            return res.send({ message: 'Categoria encontrada:', findCategory })   
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({err, message: 'Error obteniendo la categoria'});
    }
}
