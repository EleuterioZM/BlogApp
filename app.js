// Carregando módulos
const express = require('express');
const { create } = require('express-handlebars'); // Importação correta para versão 8
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');

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
const mongoose = require('mongoose');
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

// Servidor
app.listen(8081, () => {
    console.log('Servidor rodando na porta 8081!');
});
