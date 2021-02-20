const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, createProduct, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { productExists, categoryExists } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validacion-campos');

const router = Router();

// Obtener productos
router.get('/', getProducts);

// Obtener producto
router.get('/:id', [
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(productExists),
    validarCampos
], getProduct);

// Crear producto
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un ID de Mongo válido').isMongoId(),
    check('category').custom(categoryExists),
    validarCampos
], createProduct);

// Actualizar producto
router.put('/:id', [
    validateJWT,
    check('category', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(productExists),
    validarCampos
], updateProduct);

// Borrar producto - admin
router.delete('/:id', [
    validateJWT,
    //isAdminRole
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(productExists),
    validarCampos
], deleteProduct);

module.exports = router;