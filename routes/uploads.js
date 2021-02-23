const { Router } = require('express');
const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { check } = require('express-validator');
const { validarCampos, validateFile } = require('../middlewares');
const { validCollections } = require('../helpers');

const router = Router();

router.post('/', validateFile, loadFile);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('collection').custom(col => validCollections(col, ['users', 'products'])),
    validarCampos
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('collection').custom(col => validCollections(col, ['users', 'products'])),
    validarCampos
], showImage)

module.exports = router;