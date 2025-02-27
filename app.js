// Carregando módulos
const express = require('express');
const { create } = require('express-handlebars'); // Importação correta para versão 8
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const usuario = require('./routes/usuario');
// model
const mongoose = require('mongoose'); 
require('./models/Postagem'); // Agora mongoose já está disponível
require('./models/Categoria');
require('./models/Usuario');
const Postagem = mongoose.model('postagens'); // Agora pode ser usado corretamente
const Categoria = mongoose.model('categorias');
const Usuario = mongoose.model('usuarios');




// Configurações
// Configurando a sessão
app.use(session({
    secret: 'blogapp',
    resave: true,
    saveUninitialized: true
}));

// Configurando o flash
app.use(flash());

// Middleware para mensagens flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars com helper 'eq'
const hbs = create({
    defaultLayout: 'main',
    helpers: {
        eq: (a, b) => a === b,
        formatDate: (date) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString('pt-BR', options);
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,  // Permite acessar propriedades como _id
        allowProtoMethodsByDefault: true      // Permite acessar métodos do protótipo
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Mongoose

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp').then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.log('Erro ao conectar ao MongoDB: ' + err);
});

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/admin', admin);
app.use('/usuarios', usuario);
// Rota Principal
app.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({date: 'desc'}).then((postagens) => {
        res.render('home/index', {postagens: postagens});
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar postagens: ' + err);
        res.redirect('/404');
    });
});

// Página de erro 404
app.get('/404', (req, res) => res.send('Erro!'));

// Rota para exibir uma postagem específica
app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).populate('categoria').lean()
        .then(postagem => {
            if (!postagem) {
                req.flash('error_msg', 'Postagem não encontrada.');
                return res.redirect('/');
            }
            res.render('home/postagem', { postagem });
        })
        .catch(err => {
            req.flash('error_msg', 'Erro ao carregar postagem: ' + err);
            res.redirect('/');
        });
});

// Listagem de categorias
app.get('/categorias', (req, res) => {
    Categoria.find().lean()
        .then(categorias => res.render('home/categorias', { categorias }))
        .catch(err => {
            req.flash('error_msg', 'Erro ao listar categorias: ' + err);
            res.redirect('/');
        });
});

// Exibir postagens de uma categoria específica
app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({ slug: req.params.slug })
        .then(categoria => {
            if (!categoria) {
                req.flash('error_msg', 'Categoria não encontrada.');
                return res.redirect('/categorias');
            }
            Postagem.find({ categoria: categoria._id })
                .then(postagens => res.render('home/categorias', { postagens, categoria }))
                .catch(err => {
                    req.flash('error_msg', 'Erro ao listar postagens: ' + err);
                    res.redirect('/');
                });
        })
        .catch(err => {
            req.flash('error_msg', 'Erro ao carregar categoria: ' + err);
            res.redirect('/');
        });
});

app.get('/usuarios/registro', (req, res) => {
    res.render('usuarios/registro');
});


// Iniciando o servidor
app.listen(8081, () => console.log('Servidor rodando na porta 8081!'));
