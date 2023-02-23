//Importacion
const { response, request } = require('express');
//Modelos
const Curso = require('../models/curso');

const obtenerCursos = async(req = request, res = response) => {

     //Condición, me busca solo los cursos que tengan estado en true
     const query = { estado: true };

     const listaCursos = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query).populate('usuario', 'nombre')
     ]);
 
     res.json({
         msg: 'GET API de usuarios',
        listaCursos
     });


}

const obtenerCursoPorId = async(req = request, res = response) => {

    const { id } = req.params;
    const curso = await Curso.findById( id )
                                            .populate('usuario', 'nombre');

    res.json({
        msg: 'curso por id',
        curso
    });

}


const crearCurso = async (req = request, res = response) => {

    const nombre  = req.body.nombre.toUpperCase();

    //Validación para encontar un curso por nombre en la DB
    const cursoDB = await Curso.findOne({ nombre });
    if (cursoDB) {
        return res.status(400).json({
            msg: `La curso ${cursoDB.nombre}, ya existe en la DB`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const curso = new Curso(data);

    //Guardar en DB
    await curso.save();

    res.status(201).json({
        msg: 'Post de curso',
        curso
    });

}


const actualizarCurso = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase(); //cambiamos el nombre todo a mayusculas
    data.usuario = req.usuario._id; //hacemos referencia al usuario que hizo el put por medio del token

    //Edición de curso                                         // new: true Sirve para enviar el nuevo documento actualizado     
    const curso = await Curso.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        msg: 'Put de curso',
        curso
    });

}


const eliminarCurso = async(req = request, res = response) => {

    const { id } = req.params;
    const cursoBorrado = await Curso.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: 'delete curso',
        id,
        cursoBorrado
    });

}



module.exports = {
    obtenerCursos,
    obtenerCursoPorId,
    crearCurso,
    actualizarCurso,
    eliminarCurso
}