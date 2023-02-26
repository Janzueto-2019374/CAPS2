const {Router} = require('express');
const { getAsignacion, postAsignacion, putAsignacion, deleteAsignacion } = require('../controllers/asignacion');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esMaestroRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/cursosAsignados/:id', [
    validarJWT
], getAsignacion);

router.post('/agregar', [
    validarJWT,
], postAsignacion);



module.exports = router