var express = require('express');
var router = express.Router();
let middlewares = require('../middlewares')
let user_controller = require('../../controllers/UserController')

router.get('/profile', middlewares.isLoggedIn, user_controller.action_profile)
 

module.exports = router;
