module.exports = {
  admin: function(req, res, next) {
    if(req.isAuthenticated() && req.user.eAdmin == 1){
      return next()
    }else {
      res.send({texto: 'Você não tem autorização para acessar esta página.'})
    }
  },
  isAuth: function (req, res, next) {
    if(req.isAuthenticated()){
      return next()
    } else res.send({texto: 'Você não tem autorização para acessar esta página.'})
  }
}