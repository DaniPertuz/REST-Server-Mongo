const { response } = require("express");
const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const noImage = '../assets/no-image.jpg';

const loadFile = async (req, res = response) => {
    try {
        const fileName = await uploadFile(req.files, undefined, 'imgs');

        res.json({
            fileName
        });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateImage = async (req, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe usuario con el ID ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                const pathImage = path.join(__dirname, '../uploads', collection, noImage);
                return res.sendFile(pathImage);
            }
            break;

        default:
            return res.status(500).json({ msg: 'Colección no validada' });
    }

    // Limpiar imágeners previas
    if (model.img) {
        // Borrar imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }

    const fileName = await uploadFile(req.files, undefined, collection);
    model.img = await fileName;

    await model.save();

    res.json(model);
}

const updateImageCloudinary = async (req, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe usuario con el ID ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                const pathImage = path.join(__dirname, '../uploads', collection, noImage);
                return res.sendFile(pathImage);
            }
            break;

        default:
            return res.status(500).json({ msg: 'Colección no validada' });
    }

    // Limpiar imágeners previas
    if (model.img) {
        // Borrar imagen del servidor
        const nameFile = model.img.split('/');
        const name = nameFile[nameFile.length - 1];
        const [public_id] = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilepath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload(tempFilepath);

    model.img = secure_url;

    await model.save();

    res.json(model);
}

const showImage = async (req, res = response) => {
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe usuario con el ID ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe producto con el ID ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Colección no validada' });
    }

    // Limpiar imágeners previas
    if (model.img) {
        // Borrar imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }
    }

    const pathImage = path.join(__dirname, '../uploads', collection, noImage);

    res.sendFile(pathImage);
}

module.exports = {
    loadFile,
    updateImage,
    updateImageCloudinary,
    showImage
}