
const {Router} = require('express');
const { usuarioGET,
        usuarioPOST,
        usuarioPUT,
        usuarioDELETE,
        usuarioPATCH
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuarioGET);

router.post('/', usuarioPOST);

router.put('/:id', usuarioPUT);

router.delete('/', usuarioDELETE);

router.patch('/', usuarioPATCH);

module.exports = router;