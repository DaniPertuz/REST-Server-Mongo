const validarCampos = require('../middlewares/validacion-campos');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validateFile = require('../middlewares/validate-file');

module.exports = {
    ...validarCampos,
    ...validateFile,
    ...validateJWT,
    ...validateRoles
}