//importando o express + handlebars + body-parser
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const controllerLogin = require('./controllers/login');
const controllerAlunos = require('./controllers/alunos');

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

//controle de sessao
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', controllerLogin.login);

//rotas
app.get('/', controllerAlunos.sessao);

app.get('/novo', controllerAlunos.novo);

app.get('/:idAluno', controllerAlunos.idAluno);

app.post('/salvar', controllerAlunos.salvar);

app.get('/del/:idAluno', controllerAlunos.deletaIdAluno);

//conectando o servidor
app.listen(3000, () => {
  console.log('Ouvindo a porta 3000!')
});
