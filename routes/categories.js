const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { validateJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validacion-campos');
const { categoryExists } = require('../helpers/db-validators')

const router = Router();

/**
 * {{url}}/api/categories
 */

// Obtener todas las categorías
router.get('/', getCategories);

// Obtener todas una categoría por ID
router.get('/:id', [
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(categoryExists),
    validarCampos
], getCategory);

// Obtener una categoría
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createCategory);

// Actualizar una categoría
router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(categoryExists),
    validarCampos
], updateCategory);

// Borrar una categoría - admin
router.delete('/:id', [
    validateJWT,
    //isAdminRole
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom(categoryExists),
    validarCampos
], deleteCategory);

module.exports = router;