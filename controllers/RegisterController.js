let User = require('../models/UserModel')
let mongoose = require('mongoose')

exports.action_register_create = (req, res, next) => {
	res.render('register/create')
}

exports.register_create = (req, res, next) => {
	let date = new Date();
	let user = new User(
        {	
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            edad: req.body.edad,
            dni: req.body.dni,
            correo: req.body.correo,
            password: req.body.password,
            direccion: null,
            telefono: null,
            celular: null,
            fecha_creacion: date,
            fecha_actualizacion: date,
            url_imagen: null,
            estado: true
        }
    )
	User.AddUser(user,function (err) {
        if (err) {
            return next(err);
        }
        console.log('User Created successfully');
        res.redirect('/');
        
    });
}
