const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// modelo de usuario
const Usuario = require('../models/Usuario')

module.exports = function(passport){
	passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
		Usuario.findOne({email: email})
			.then((usuario) => {
				if(!usuario){
					return done(null, false, {texto: 'Esta conta não existe.'})
				}
				bcrypt.compare(senha, usuario.senha, (erro, ok) => {
					if(ok){
						return done(null, usuario)
					} else{
						return done(null, false, {texto: 'Senha incorreta.'})
					}
				})
			})
	}))

	passport.serializeUser((usuario, done) =>{
		if(usuario) {
			return done (null, usuario.id)
		}else {
			return done (null, false)
		}
	})
  
	passport.deserializeUser((id, done) => {
		Usuario.findById(id, (err, usuario) => {
			if(err) {
				return done(null, false)
			}else {
				return done(null, usuario)
			}
		})
	})
}