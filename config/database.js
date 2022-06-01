const mongoose = require('mongoose')
require('dotenv').config()

const config = {
	uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@apicluster.kbp4k.mongodb.net/bddcurso?retryWrites=true&w=majority`,
}

mongoose.connection.on('open', () => {
	console.log('Banco conectado!')
})

mongoose.connection.on('error', () => {
	throw new Error('Erro ao conectar ao banco de dados.')
})

module.exports = {
	connect: () => mongoose.connect(config.uri)
}