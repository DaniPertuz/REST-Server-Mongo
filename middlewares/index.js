const validarCampos = require('../middlewares/validacion-campos');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');

module.exports = {
    ...validarCampos,
    ...validateJWT,
    ...validateRoles
}