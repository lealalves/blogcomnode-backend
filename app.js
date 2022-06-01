// carregando modulos
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const app = require('./config/server')
const database = require('./config/database')

require('dotenv').config()

// rotas
app.use('/admin', admin)
app.use('/usuarios', usuarios)

database.connect().then(app.listen(process.env.PORT || 8081, () => console.log('Servidor rodando!')))
