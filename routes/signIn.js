let express = require('express')
let router = express.Router()
let passport = require('passport')

let sign_in_controller = require('../controllers/SignInController')

router.get('/auth/google', 
	passport.authenticate('google', { scope : ['profile', 'email'] }))
	 
router.get('/auth/google/callback', 
	passport.authenticate('google', { failureRedirect: '/error' }), sign_in_controller.authenticate_user_success)

router.get('/verify-user', sign_in_controller.verify_user)

module.exports = router