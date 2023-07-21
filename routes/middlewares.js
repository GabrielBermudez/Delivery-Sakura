exports.isLoggedInIsAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) 
    	return next()

    res.redirect('/')
}

exports.isLoggedIn = (req,res,next) => {
	if (req.session.user)
		return next()
	res.redirect('/')
}

exports.isNotLoggedIn = (req,res,next) => {
	if (!req.session.user)
		return next()
	
	res.redirect('/')
}