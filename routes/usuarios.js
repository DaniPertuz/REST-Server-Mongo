const { Router } = require('express');
const { check } = require('express-validator');

const { isRoleValid, emailExists, validUserID } = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validacion-campos');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdminRole, hasRole } = require('../middlewares/validate-roles');

const { validarCampos, validateJWT, isAdminRole, hasRole } = require('../middlewares')

const { usuarioGET,
    usuarioPOST,
    usuarioPUT,
    usuarioDELETE,
    usuarioPATCH
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuarioGET);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'Contraseña debe tener más de 6 caracteres').isLength({ min: 6 }),
    //check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExists),
    // check('role', 'Rol no válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isRoleValid),
    validarCampos
], usuarioPOST);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validUserID),
    check('role').custom(isRoleValid),
    validarCampos
], usuarioPUT);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    //hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validUserID),
    validarCampos
], usuarioDELETE);

router.patch('/', usuarioPATCH);

module.exports = router;