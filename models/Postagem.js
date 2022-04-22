const mongoose = require('mongoose')

const Postagem = mongoose.model('Postagem', {
	titulo: {
		type: String,
		require: true
	},
	slug: {
		type: String,
		require: true
	},
	descricao: {
		type: String,
		require: true
	},
	conteudo: {
		type: String,
		require: true
	},
	categoria: {
		type: mongoose.Types.ObjectId,
		ref: 'Categoria',
		require: true
	},
	autor: {
		type: mongoose.Types.ObjectId,
		ref: 'Usuario',
		require: true
	},
	date: {
		type: Date,
		default: Date.now()
	}
})

module.exports = Postagem