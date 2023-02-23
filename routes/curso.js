const { Router } = require('express');
const { check } = require('express-validator');

const { existeCursoPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

//Controllers
const { obtenerCursos, obtenerCursoPorId, crearCurso, actualizarCurso, eliminarCurso } = require('../controllers/curso');

const router = Router();

// Obtener todas las cursos - publico
router.get('/', obtenerCursos);

// Obtener una curso por el id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    validarCampos
],obtenerCursoPorId);

// Crear Curso - privado - cualquier persona con un token valido
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre de la curso es obligatorio').not().isEmpty(),
    validarCampos
], crearCurso);

// Actualizar Curso - privado - se requiere id y un token valido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    check('nombre', 'El nombre de la curso es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCurso);

// Borrar una Curso - privado - se requiere id y un token valido - solo el admin puede borrar
router.delete('/eliminar/:id', eliminarCurso);

module.exports = router;