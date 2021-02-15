const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/generateJWT");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas - Email incorrecto'
            });
        }

        // Verificar si el usuario está activo
        if(!user.status) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas - Estado inactivo'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas - Contraseña incorrecta'
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrió un error'
        });
    }
}

module.exports = {
    login
};