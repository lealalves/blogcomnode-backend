const express = require('express')

const router = express.Router()

const userController = require('../controllers/users')

router.get('/', (req, res) => {
	if(req.isAuthenticated()){
		res.send({usuario: req.user, ok: true})
	}else {
		res.send({texto: 'Nenhum usuário logado.'})
	}
})

router.get('/logout', (req, res) => userController.logout(req, res))
router.post('/login', (req, res, next) => userController.login(req, res, next))
router.post('/registro', (req, res) => userController.register(req, res))

module.exports = router