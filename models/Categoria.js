const mongoose = require('mongoose')

const Categoria = mongoose.model('Categoria', {
	nome: {
		type: String,
		require: true
	},
	slug: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now()
	}
})

module.exports = Categoria