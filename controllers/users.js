const Usuario = require('../models/Usuario')
const passport = require('passport')
const bcrypt = require('bcrypt')

module.exports = {
	async login (req, res, next) {
		const {email, senha} = req.body

		let errors = []
	
		if(!email || email == null || email == undefined){
			errors.push({texto: 'Por favor, digite o seu e-mail.'})
		}
	
		if(!senha || senha == null || senha == undefined){
			errors.push({texto: 'Por favor, digite sua senha.'})
		}
	
		if(errors.length > 0){
			return res.send(errors)
		} else {
			passport.authenticate('local', (done, usuario, error) =>{
				if(!usuario){
					errors.push(error)
					res.send(errors)
				}
				req.logIn(usuario, (error) => {
					if(error) {
						return
					}
					res.send({texto: 'Logado com sucesso!', ok: true, usuario: usuario})
				})
	
			})(req, res, next)
		}
	},
	async register(req, res) {
		const {nome, email, senha, senha2} = req.body

		let errors = []

		if(!nome || nome == undefined || nome == null){
			errors.push({texto: 'Nome inválido.'})
		}

		if(!email || email == undefined || email == null){
			errors.push({texto: 'E-mail inválido.'})
		}

		if(!senha || senha == undefined || senha == null){
			errors.push({texto: 'Senha inválida.'})
		}

		if(senha < 4){
			errors.push({texto: 'Senha muito curta.'})
		}

		if(senha != senha2 ){
			errors.push({texto: 'Repita a senha corretamente.'})
		}

		if(nome < 2){
			errors.push({texto: 'Nome muito curto.'})
		}

		if(errors.length > 0){
			res.send(errors)
		} else {
		
			Usuario.findOne({email: email})
				.then((usuario) => {
					if(usuario) {
						errors.push({texto: 'Este e-mail já está sendo usado por outro usuário.'})
						res.send(errors)
					}else {
						bcrypt.genSalt(10, (erro, salt) => {
							bcrypt.hash(senha, salt, (erro, novasenha) => {
								if(erro){
									errors.push({texto: 'Houve um erro ao tentar salvar o usuário.'})
									res.send(errors)
								}else {              
									const novoUsuario = new Usuario({
										nome: nome,
										email: email,
										senha: novasenha,
									})
									novoUsuario.save()
										.then(() => res.send({texto: 'Usuário cadastrado com sucesso! Faça já o seu login.', ok: true}))
										.catch((err) => {
											errors.push({texto: 'Houve um erro ao tentar cadastrar o usuário.'})
											res.send(errors)
										})              
								}
							})
						})
					}
				})
				.catch((err) => {
					errors.push({texto: 'Houve um erro interno.'})
					res.send(errors)
				})
		}  
	},
	async logout(req, res) {
		req.logout()
		res.send({texto: 'Deslogado com sucesso!', ok: true})
	}
}