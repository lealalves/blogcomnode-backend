// carregando modulos
    const express = require('express')
    const cors = require('cors')
    const mongoose = require('mongoose')
    const admin = require('./routes/admin')
    const usuarios = require('./routes/usuario')
    const session = require('express-session')
    const Postagem = require('./models/Postagem')
    const Categoria = require('./models/Categoria')
    const passport = require('passport')
    const MongoStore = require('connect-mongodb-session')(session)

    require('dotenv').config()    
    require('./config/auth')(passport)

    const app = express()
    
// configurações
    app.use(cors())
    app.use(
        express.urlencoded({
            extended: true
        })
    )
    app.use(express.json())
    const store = new MongoStore({
      uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@apicluster.kbp4k.mongodb.net/`,
      collection: 'blogSession'
    })
// sessao
    app.set('trust proxy', 1)
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: store,
        cookie: {
          secure: (process.env.NODE_ENV && process.env.NODE_ENV == 'production') ? true : false
        }
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use((req, res, next) => {
      res.locals.user = req.user || null
      next()
    })
// conexao mongodb
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@apicluster.kbp4k.mongodb.net/bddcurso?retryWrites=true&w=majority`)
    .then(() => {
      console.log("Banco Conectado!");
    }).catch((err) => console.log(err))
// rotas
    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
  
    app.get('/', (req, res) =>{
      Postagem.find().populate('categoria').sort({date: 'DESC'})
      .then((postagens) => res.send({postagens, ok: true}))
      .catch((err) => res.send({texto: 'Houve um erro ao buscar postagens', ok: false}))
    })

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug})
        .then((postagem) => {
            if(postagem){
                res.send({postagem, ok: true})
            } else {
                res.send({texto: 'Postagem inexistente.', ok: false})
            }
        })
        .catch((err) => {
            console.log(err);
            res.send({texto: 'Houve um erro interno.'})
        })
        
    })

    app.get('/categorias', (req, res) => {
        Categoria.find()
        .then((categorias) => res.send({categorias, ok: true}))
        .catch(() => res.send({texto: "Houve um erro ao tentar listar as categorias", ok: false}))

    })

    app.get('/categorias/:slug', (req, res) => {
      Categoria.findOne({slug: req.params.slug})
      .then((categoria) => {
        Postagem.find({categoria: categoria._id})
        .then((postagens) => res.send({categoria, postagens, ok: true}))
        .catch((err) => res.send({texto: 'Nenhuma postagem localizada!', ok: false}))
       })
      .catch((err) => res.send({texto: 'Categoria inexistente'}))
    })
// outros
app.listen(process.env.PORT || 8081, () => console.log('Servidor rodando!'))
