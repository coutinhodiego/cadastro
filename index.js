//importando o express + handlebars + body-parser
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
//importando mongoose(para manipular o mongo)
const mongoose = require('mongoose');
//inicializa o express
const app = express();
// configurando o middleware handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
//configurando o middleware do body-parser
app.use(session({secret: 'segredo'}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
//conectar o DB
mongoose.connect('mongodb://localhost/mastertech');

//Criando um schema Aluno (mongoose)
const AlunoSchema = mongoose.model('Aluno', {nome: String, idade: Number});
// const users = require('./data/users.json');
const Users = mongoose.model('users', {email: String, senha: String});

//controle de sessao
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
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
});
//rotas

app.get('/', (req, res) => {
  if(req.session.email){
    AlunoSchema.find((err, listaAlunos) => {
      if(err){
        res.render('erro');
      }
      res.render('index', {list: listaAlunos, title: 'Lista de Alunos'});
    });
  }else{
    res.redirect('/login')
  }
});

app.get('/novo', (req, res) => {
  res.render('formAluno')
});

app.get('/:idAluno', (req, res) => {
  AlunoSchema.findById(req.params.idAluno, (err, aluno) => {
    res.render('formAluno', {a : aluno});
  });
});

app.post('/salvar', (req, res) => {
  if(req.body._id !== ''){
    AlunoSchema.findByIdAndUpdate(req.body._id, req.body, {new : true}, (err, aluno) =>{
      res.redirect('/');
    });
  }else{
    let alunoForm = new AlunoSchema(req.body);
    alunoForm._id = null;
    alunoForm.save((err, a) => {
      res.redirect('/');
    });
  };
});

app.get('/del/:idAluno', (req, res) => {
  AlunoSchema.findByIdAndRemove(req.params.idAluno, (err, aluno) => {
    console.log(err);
  });
  res.redirect('/');
});

//conectando o servidor
app.listen(3000, () => {
  console.log('Ouvindo a porta 3000!')
});
