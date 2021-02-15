const { response, request } = require('express');

const isAdminRole = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Se está verificando rol sin el token'
        });
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no tiene privilegios de administrador`
        });
    }

    next();
}

const hasRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Se está verificando rol sin el token'
            });
        }

        if(!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            });
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}