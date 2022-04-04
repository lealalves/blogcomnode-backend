const mongoose = require('mongoose')

const Usuario = mongoose.model('Usuario', {
  nome: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  eAdmin: {
    type: Number,
    default: 0
  },
  senha: {
    type: String,
    require: true
  }
})

module.exports = Usuario