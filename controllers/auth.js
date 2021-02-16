const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas - Email incorrecto'
            });
        }

        // Verificar si el usuario está activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas - Estado inactivo'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
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

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const { email, name, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                email,
                password: '',
                img,
                google: true
            };

            user = new User(data);
            await user.save();
        }

        // Si el usuario en DB
        if (!user.status) {
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            msg: 'Token de Google no es válido'
        });
    }
}

module.exports = {
    login,
    googleSignIn
};