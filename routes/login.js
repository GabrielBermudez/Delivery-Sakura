let express = require('express')
let router = express.Router()

let login_controller = require('../controllers/LoginController')
let middlewares = require('./middlewares')

router.get('/index', middlewares.isNotLoggedIn, login_controller.action_login_index)
	
router.post('/', login_controller.user_login)

router.get('/logout', login_controller.user_logout)

router.get('/reset-password',middlewares.isNotLoggedIn,login_controller.action_login_reset_password)
router.post('/reset-password', login_controller.reset_password)

router.get('/change-password/id/:id/token/:token', middlewares.isNotLoggedIn, login_controller.action_change_password)
router.post('/change-password',middlewares.isNotLoggedIn, login_controller.change_password)
module.exports = router