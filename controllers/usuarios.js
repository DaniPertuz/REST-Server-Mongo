const { response } = require('express')

const usuarioGET = (req, res = response) => {

    const {q, nombre = 'No name', apiKey} = req.query;

    res.json({
        "msg": "GET Request - Controlador",
        q,
        nombre,
        apiKey
    });
}

const usuarioPOST = (req, res = response) => {

    // const body = req.body;
    const { nombre, edad } = req.body;

    res.json({
        "msg": "POST Request - Controlador",
        nombre,
        edad
    });
}

const usuarioPUT = (req, res = response) => {

    // const id = req.params.id;
    const { id } = req.params;

    res.json({
        "msg": "PUT Request - Controlador",
        id
    });
}

const usuarioDELETE = (req, res = response) => {
    res.json({
        "msg": "DELETE Request - Controlador"
    });
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