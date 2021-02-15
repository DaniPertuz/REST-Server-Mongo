const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer usuario correspondiente a uid
        const user = await User.findById(uid);

        // Verificar si usuario existe
        if (!user) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BD'
            });
        }

        // Verificar si uid está activo
        if (!user.status) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no activo'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validateJWT
}