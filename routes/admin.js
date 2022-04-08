const express = require('express')
const router = express.Router()
const Categoria = require('../models/Categoria')
const Postagem = require('../models/Postagem')
const {admin} = require('../helpers/userAcess')
const {isAuth} = require('../helpers/userAcess')

router.get('/', (req, res) => {
    res.send('Página principal painel administrativo')
})

// Rotas Postagens

router.get('/postagens', admin, (req, res) => {
  Postagem.find().populate('categoria').sort({date: 'desc'})
  .then((postagens) => res.send({postagens, ok: true}))
  .catch((err) => console.log(err))
})

router.post('/postagens/nova', isAuth, (req, res) => {
    const {titulo, slug, descricao, conteudo, categoria} = req.body

    let errors = []

    if(!titulo || titulo == undefined || titulo == null){
        errors.push({texto: "Título Inválido."})
    }

    if(!slug || slug == undefined || slug == null){
        errors.push({texto: "Slug Inválido."})
    }

    if(!descricao || descricao == undefined || descricao == null){
        errors.push({texto: "Descrição Inválida."})
    }

    if(!conteudo || conteudo == undefined || conteudo == null){
        errors.push({texto: "Conteúdo Inválido."})
    }

    if(categoria == 0){
        errors.push({texto: "Categoria Inválida."})
    }

    if(errors.length > 0){
        res.json(errors)
    } else {

        const postagem = new Postagem({
            titulo: titulo,
            slug: slug,
            descricao: descricao,
            conteudo: conteudo,
            categoria: categoria
        })

        postagem.save()
        .then(() => res.send({texto: 'Postagem salva com sucesso!', ok: true}))
        .catch((err) => res.send({texto: 'Houve um erro ao salvar a postagem.', ok: false}))
    }
})

router.get('/postagens/editar/:id', admin, (req, res) =>{
    Postagem.findById(req.params.id)
    .then((postagem) => {
        Categoria.find()
        .then((categoria) => res.send({categoria, postagem, ok: true}))
        .catch((err) => res.send({err, ok: false}))
    })
    .catch((err) => res.send({err, ok: false}))
})

router.post('/postagens/editar', admin, (req, res) => {
    const {titulo, slug, categoria, conteudo, descricao} = req.body

    let errors = []

    if(!titulo || titulo == undefined || titulo == null){
        errors.push({texto: "Título Inválido."})
    }

    if(!slug || slug == undefined || slug == null){
        errors.push({texto: "Slug Inválido."})
    }

    if(!descricao || descricao == undefined || descricao == null){
        errors.push({texto: "Descrição Inválida."})
    }

    if(!conteudo || conteudo == undefined || conteudo == null){
        errors.push({texto: "Conteúdo Inválido."})
    }

    if(categoria == 0){
        errors.push({texto: "Categoria Inválida."})
    }

    if(errors.length > 0){
        res.json(errors)
    } else {

        Postagem.findById(req.body.id)
        .then((postagem) => {
            postagem.titulo = titulo
            postagem.slug = slug
            postagem.descricao = descricao
            postagem.categoria = categoria
            postagem.conteudo = conteudo

            postagem.save()
            .then(() => res.send({texto: 'Postagem editada com sucesso!', ok: true}))
            .catch((err) => res.send({texto: 'Houve um erro ao tentar editar a postagem.', ok: false}))

        })
        .catch((err) => res.send({texto: 'Postagem não encontrada.', ok: false}))


    }


})

router.get('/postagens/deletar/:id', admin, (req, res) => {
    Postagem.findByIdAndDelete(req.params.id)
    .then(() => res.send({texto: 'Postagem excluída com sucesso!', ok: true}))
    .catch((err) => res.send({texto: 'Houve um erro ao tentar excluir a postagem.', ok: false}))
})

// Rotas Categorias

router.get('/categorias', isAuth, (req, res) => {
    Categoria.find().sort({date: 'desc'})
    .then((categorias) =>{
        res.send({categorias, ok: true})
    })
    .catch({texto: 'Houve um erro ao consultar o banco de dados!', ok: false})
})

router.post('/categorias/nova', admin, (req, res) => {
    const {nome, slug} = req.body


    let errors = []

    if(!nome || nome == undefined || nome == null){
        errors.push({texto: "Nome Inválido."})
    }

    if(!slug || slug == undefined || slug == null){
        errors.push({texto: "Slug Inválido."})
    }

    if(nome.length < 2){
        errors.push({texto: "Nome da categoria é muito curto."})
    }

    if(errors.length > 0){
        res.send(errors)
    } else{

        const categoria = new Categoria({
            nome: nome,
            slug: slug
        })
        
        categoria.save()
        .then(() => res.send({texto: "Categoria salva com sucesso!", ok: true}))
        .catch((err) => {
            res.send({texto: "Houve um erro ao tentar salvar a categoria, tente novamente mais tarde.", ok: false})
            console.log(err);
        })

    }

})

router.get('/categoria/editar/:id', admin, (req, res) => {
    Categoria.findById(req.params.id)
    .then((categoria) => res.send({categoria, ok: true}))
    .catch((err) => res.send({err, ok: false}))
})

router.post('/categoria/editar', admin, (req, res) => {
    const {nome, slug} = req.body

    let errors = []

    if(!nome || nome == undefined || nome == null){
        errors.push({texto: 'Nome inválido.'})
    }
    if(!slug || slug == undefined || slug == null){
        errors.push({texto: 'Slug inválido.'})
    }
    if(nome.length < 2){
        errors.push({texto: 'Nome curto demais.'})
    }

    if(errors.length > 0) {
        res.send(errors)
    } else {

        Categoria.findById(req.body.id)
        .then((categoria) => {

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save()
            .then(() => {
                res.send({texto: 'Categoria editada com sucesso!', ok: true})
            })
            .catch((err) => {
                res.send({texto: 'Erro ao tentar editar a categoria.', ok: false})
            })

        })
        .catch((err) => res.send({texto: 'Categoria não encontrada.', ok: false}))

    }
})

router.get('/categoria/deletar/:id', admin, (req, res) => {
    Categoria.findByIdAndDelete(req.params.id)
    .then(() => {
        res.send({texto: 'Categoria deletada com sucesso!', ok: true})
    })
    .catch((err) => {
        res.send({texto: 'Houve um erro ao tentar deletar a categoria.', ok: false})
    })
})
module.exports = router

