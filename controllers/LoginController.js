const User = require('../models/UserModel')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.action_login_index = (req, res, next ) => {
	res.render('login/index')
}

exports.action_login_reset_password = (req,res) => {
    res.render('login/reset-password')
}

exports.user_login = function (req, res) {

    User.FindUserByEmail(req.body.correo,function(err,usuario) {
        if (err) {
            return next(err);
        }
        if(usuario){
            bcrypt.compare(`${req.body.password}-${usuario.fecha_creacion.getTime()}`, usuario.password, function(err, result) {
                if(result){
                    req.session.user = usuario 
                    res.redirect('/')
                }else{
                    res.render('login/index',{ error: 'Correo y/o contraseña invalida' });
                }
            }) 
        }
    })
}

exports.user_logout = (req,res,next) => {
    req.session.user = null;
    res.redirect('/');
}


exports.reset_password = (req,res,next) =>{

    User.FindUserByEmail(req.body.correo, (err, user)=>{
        if(err)
            return next(err)
        let token = jwt.sign({
            user
        }, `${user.password}-${user.fecha_creacion.getTime()}`, {expiresIn: '3600s'});

        let transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
               user: 'sakuradevcode@gmail.com',
               pass: 'hbgoavrbflountwy'
           }
        })
        const hosty = req.headers.host;

        let mailOptions = {
           from: 'sakuradevcode@gmail.com',
           to: req.body.correo,
           subject: 'Restablecer Contraseña',
           html: `<h4>Link</h4> <a href="http://${hosty}/login/change-password/id/${user._id}/token/${token}">Cambiar Contraseña</a>`
          
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error){
                console.log(error);
                
            } else {
                console.log("Email sent" + info.response);
                
            }
            res.redirect('/')
        });
    })
}


exports.action_change_password = (req, res, next) => {
    let {id,token} = req.params
    User.FindUserByID(id, (err, user) => {
        if(err)
            return next(err)

        let secret = `${user.password}-${user.fecha_creacion.getTime()}`

        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                console.log('This token is not available')
                res.redirect('/')
            } else {
                res.render('login/change-password', {id:payload.user._id, token})
            }
        });

    })
}

exports.change_password = (req, res, next) => {
    let {id,token,password} = req.body
    const saltRounds = 10

    User.FindUserByID(req.body.id, (err, user) => {
        if(err)
            return next(err)

        let secret = `${user.password}-${user.fecha_creacion.getTime()}`

        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                console.log('This token is not available')
                res.redirect('/')
            } else {
                bcrypt.hash(`${password}-${user.fecha_creacion.getTime()}`, saltRounds, function(err, hash) {
                    if (err) {
                        return next(err)
                    }
                    user.password = hash
                    User.UpdateUser(user)
                    console.log('The password has changed sucessfully')
                    res.redirect('/')
                })
            }  
        })  
    })
}