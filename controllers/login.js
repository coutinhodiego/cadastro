const mongoose = require('mongoose');
const Users = mongoose.model('users', {email: String, senha: String});

module.exports.login = (req, res) => {
    if(req.body.email == '' || req.body.senha == '') {
      res.status(400).render('login', {erro: 'Preencha todos os campos.'});
    }else{
      Users.find({email: req.body.email, senha: req.body.senha}, (err, user) => {
        if (user.length > 0){
          req.session.email = req.body.email
          console.log(`imprimindo o user ${user} ---- e o session ${req.session.email}`);
          return res.redirect('/');
        }else{
          console.log('pulei pro else de err');
          res.status(400);
          return res.render('login', {erro: 'Usuario e/ou senha invalidos.'});
        }
      });
    };
}
