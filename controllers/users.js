const passport = require('passport')

class UsersController {
	constructor (User) {
		this.User = User
	}

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
	}
}

module.exports = UsersController