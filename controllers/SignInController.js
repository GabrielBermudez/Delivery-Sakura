let passport = require('passport')

exports.authenticate_user_success = (req,res,next) => {
	res.redirect('/sign-in/verify-user')
}

exports.verify_user = (req,res,next) => {
	console.log(req.session.passport.user)
	res.redirect('/')
}

