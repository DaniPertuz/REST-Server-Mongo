const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

const collections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUser = async (criteria = '', res = response) => {
    const mongoID = ObjectId.isValid(criteria);

    if (mongoID) {
        const user = await User.findById(criteria);
        res.json({
            results: (user) ? [user] : []
        })
    }

    // Búsqueda ignoreCase
    const regexp = new RegExp(criteria, 'i');

    const users = await User.find({
        $or: [{ name: regexp }, { email: regexp }],
        $and: [{ status: true }]
    });

    res.json({
        results: users
    });
}

const searchCategory = async (criteria = '', res = response) => {
    const mongoID = ObjectId.isValid(criteria);

    if (mongoID) {
        const category = await Category.findById(criteria);
        res.json({
            results: (category) ? [category] : []
        })
    }

    // Búsqueda ignoreCase
    const regexp = new RegExp(criteria, 'i');

    const categories = await Category.find({ name: regexp, status: true });

    res.json({
        results: categories
    });
}

const searchProduct = async (criteria = '', res = response) => {
    const mongoID = ObjectId.isValid(criteria);

    if (mongoID) {
        const product = await Product.findById(criteria).populate('category', 'name');
        res.json({
            results: (product) ? [product] : []
        })
    }

    // Búsqueda ignoreCase
    const regexp = new RegExp(criteria, 'i');

    const products = await Product.find({ name: regexp, status: true }).populate('category', 'name');

    res.json({
        results: products
    });
}

const search = (req, res = response) => {

    const { collection, criteria } = req.params;

    if (!collections.includes(collection)) {
        return res.status(400).json({
            'msg': `Las colecciones permitidas son ${collections}`
        });
    }

    switch (collection) {
        case 'users':
            searchUser(criteria, res);
            break;
        case 'categories':
            searchCategory(criteria, res);
            break;
        case 'products':
            searchProduct(criteria, res);
            break;
        default:
            res.status(500).json({
                'msg': 'Búsqueda no incluída entre las posibilidades'
            })
    }
}

module.exports = {
    search
}