const {response, request} = require('express');

//Modelos
const Asignacion = require('../models/asignacion');

const getAsignacion = async (req = request, res = response) => {
    const {params} = req.params;
    const listaDeAsignaciones = await Promise.all([
        Asignacion.countDocuments(params),
        Asignacion.find(params)
        .populate('curso', 'nombre')
        .populate('usuario', 'nombre')
    ]);

    res.json({
        msg: 'GET API Asignacion',
        listaDeAsignaciones
    })
}

const postAsignacion = async (req = request, res = response) => {
    const {curso, usuario} = req.body;
    
    const totalAsignaciones = await Promise.all([
        Asignacion.countDocuments(usuario),
    ]);
    if(totalAsignaciones == 3) {
        res.status(201).json({
            msg: '¡Ups! Solo puedes asignarte a un maximo de 3 cursos'
        });
    }else {
        const data = {
            curso,
            usuario
        }


     // verificar si el usuario ya está asignado a este curso
    const asignacionExistente = await Asignacion.findOne({ curso, usuario });
    if (asignacionExistente) {
      return res.status(400).json({ msg: '¡Ups! Este usuario ya está asignado a este curso.' });
    }

        const asignacion = new Asignacion(data);
        await asignacion.save();

        res.status(201).json({
            msg: 'POST API Asignacion',
            totalAsignaciones,
            asignacion
        })

    }
}

// const putAsignacion = async(req = request, res = response) => {
//     const {id} = req.params;
//     const {curso, usuario} = req.body;

//     const data = {
//         curso,
//         usuario
//     }

//     const asignacionEditada = await Asignacion.findOneAndReplace(id, data, {new: true});

//     res.json({
//         msg: 'PUT API Asignacion',
//         asignacionEditada
//     })
// }

// const deleteAsignacion = async(req = request, res = response) => {
//     const {id} = req.params;

//     const asignacionEliminada = await Asignacion.findOneAndDelete(id, {new: true});

//     res.json({
//         msg: 'DELETE API Asignacion',
//         asignacionEliminada
//     })
// }

module.exports = {
    getAsignacion,
    postAsignacion,
    
}