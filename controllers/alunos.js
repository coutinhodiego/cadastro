//faz o require do mongoose para acessar o DB e cria um Schema modelo para realizar o CRUD no DB.
const mongoose = require('mongoose');
const AlunoSchema = mongoose.model('Aluno', {nome: String, idade: Number});
//verfica se a sessao esta ativa ou nao, redireciona de acordo com o estado
module.exports.sessao = (req, res) => {
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
};
// redireciona para pagina de adicionar um novo aluno na lista
module.exports.novo = (req, res) => {
  res.render('formAluno')
};
// lista os alunos na colecao Aluno
module.exports.idAluno = (req, res) => {
  AlunoSchema.findById(req.params.idAluno, (err, aluno) => {
    res.render('formAluno', {a : aluno});
  });
};
// salva um novo aluno na lista
module.exports.salvar = (req, res) => {
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
};
// deleta um aluno da lista
module.exports.deletaIdAluno = (req, res) => {
  AlunoSchema.findByIdAndRemove(req.params.idAluno, (err, aluno) => {
    console.log(err);
  });
  res.redirect('/');
};
