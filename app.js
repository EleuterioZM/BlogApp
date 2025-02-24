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
//Configurando a sessão
app.use(session({
    secret: 'blogapp',
    resave: true,
    saveUninitialized: true
}));
//configurando o flash
app.use(flash());
//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars
const hbs = create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//Mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp').then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.log('Erro ao conectar ao MongoDB: ' + err);
});
 
 //public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/admin', admin);
// Servidor
app.listen(8081, () => {
    console.log('Servidor rodando na porta 8081!');
});
