const { response } = require('express');
const { Product, Category } = require('../models');

// Obtener productos - paginado - total - populate
const getProducts = async (req, res = response) => {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        products
    });
}

// Obtener producto - populate
const getProduct = async (req, res = response) => {
    const { id } = req.params;

    const product = await Product.findById({ _id: id })
        .populate('user', 'name')
        .populate('category', 'name');

    res.json(product);
}

// Crear producto
const createProduct = async (req, res = response) => {
    const { status, user, ...body } = req.body;

    const productDB = await Product.findOne({ name: body.name.toUpperCase() });

    if (productDB) {
        return res.status(400).json({
            msg: `El producto ${productDB.name} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }

    const product = new Product(data);

    // Guardar en DB
    await product.save();

    res.json(product);
}

// Actualizar producto
const updateProduct = async (req, res = response) => {
    const { id } = req.params;

    const { status, _id, user, __v, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);
}

// Borrar categoría - estado:false
const deleteProduct = async (req, res = response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(product);
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}