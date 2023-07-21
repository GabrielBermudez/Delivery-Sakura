let User = require('../models/UserModel')
let mongoose = require('mongoose')
const bcrypt = require('bcrypt');

exports.action_register_create = (req, res, next) => {
	res.render('register/create')
}

exports.register_create = (req, res, next) => {
    const saltRounds = 10;
	let date = new Date();
    bcrypt.hash(`${req.body.password}-${date.getTime()}`, saltRounds, function(err, hash) {
        if (err) {
            return next(err)
        }
    	let user = new User(
            {	
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                edad: req.body.edad,
                dni: req.body.dni,
                correo: req.body.correo,
                password: hash,
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
                return next(err)
            }
            console.log('User Created successfully')
            res.redirect('/')
            
        })
    })
}
