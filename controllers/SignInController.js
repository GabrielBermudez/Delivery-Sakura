let passport = require('passport')
let User = require('../models/UserModel')
let mongoose = require('mongoose')
const bcrypt = require('bcrypt');

exports.authenticate_user_success = (req,res,next) => {
	res.redirect('/sign-in/verify-user')
}

exports.verify_user = (req,res,next) => {
	let date = new Date();
	const saltRounds = 10;
	req.session.user = req.session.passport.user

	User.FindUserByEmail(req.session.user.emails[0].value, (err,usuario) =>{
		if(!usuario){
			bcrypt.hash(`${req.session.user.id}-${date.getTime()}`, saltRounds, function(err, hash) {
				if (err) {
		            return next(err);
		        }
				let user = new User({	
			            nombre: req.session.user.name.givenName,
			            apellido: req.session.user.name.familyName,
			            edad: '',
			            dni: '',
			            correo: req.session.user.emails[0].value,
			            password: hash,
			            direccion: '',
			            telefono: '',
			            celular: '',
			            fecha_creacion: date,
			            fecha_actualizacion: date,
			            url_imagen: req.session.user.photos[0].value,
			            estado: true
			        })

				User.AddUser(user,function (err) {
			        if (err) {
			            return next(err);
			        }
			        console.log('User Created successfully');
			        req.session.user = user
			        res.redirect('/');
			    })
		    })
		}else{
			req.session.user = usuario
			res.redirect('/login/index')
		}
	})
}
