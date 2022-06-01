const express = require('express')
const session = require('express-session')
const cors = require('cors')
const MongoStore = require('connect-mongo')
const Postagem = require('../models/Postagem')
const Categoria = require('../models/Categoria')
const passport = require('passport')
const app = express()

require('../config/auth')(passport)
require('dotenv').config()

// configurações
app.use(cors())
app.use(
	express.urlencoded({
		extended: true
	})
)
app.use(express.json())

// sessao
const storeDb = MongoStore.create({
	mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@apicluster.kbp4k.mongodb.net/`,
	dbName: 'sessiontest'
})
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: storeDb,
	cookie: {
		secure: false,
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 48,
	}
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
	res.locals.user = req.user || null
	next()
})

app.get('/', (req, res) => {
	Postagem.find().populate('categoria').populate('autor').sort({ date: 'DESC' })
		.then((postagens) => res.send({ postagens, ok: true }))
		.catch((err) => res.send({ texto: 'Houve um erro ao buscar postagens', ok: false }))
})

app.get('/postagem/:slug', (req, res) => {
	Postagem.findOne({ slug: req.params.slug }).populate('autor')
		.then((postagem) => {
			if (postagem) {
				res.send({ postagem, ok: true })
			} else {
				res.send({ texto: 'Postagem inexistente.', ok: false })
			}
		})
		.catch((err) => {
			res.send({ texto: 'Houve um erro interno.' })
		})

})

app.get('/categorias', (req, res) => {
	Categoria.find()
		.then((categorias) => res.send({ categorias, ok: true }))
		.catch(() => res.send({ texto: 'Houve um erro ao tentar listar as categorias', ok: false }))

})

app.get('/categorias/:slug', (req, res) => {
	Categoria.findOne({ slug: req.params.slug })
		.then((categoria) => {
			Postagem.find({ categoria: categoria._id }).populate('autor')
				.then((postagens) => res.send({ categoria, postagens, ok: true }))
				.catch((err) => res.send({ texto: 'Nenhuma postagem localizada!', ok: false }))
		})
		.catch((err) => res.send({ texto: 'Categoria inexistente' }))
})

module.exports = app
