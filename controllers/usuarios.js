const { response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const usuarioGET = async (req, res = response) => {

    const { limit, from } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        users
    });
}

const usuarioPOST = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    // const { name } = req.body;

    const user = new User({ name, email, password, role });

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await user.save();

    res.json(user);
}

const usuarioPUT = async (req, res = response) => {

    // const id = req.params.id;
    const { id } = req.params;

    const { password, google, email, ...resto } = req.body;

    if (password) {
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const userDB = await User.findByIdAndUpdate(id, resto);

    res.json({
        "msg": "PUT Request - Controlador",
        userDB
    });
}

const usuarioDELETE = async(req, res = response) => {

    const { id } = req.params;

    // Borrado físico
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, {status: false});

    res.json(user);
}

const usuarioPATCH = (req, res = response) => {
    res.json({
        "msg": "PATCH Request - Controlador"
    });
}

module.exports = {
    usuarioGET,
    usuarioPOST,
    usuarioPUT,
    usuarioDELETE,
    usuarioPATCH
}