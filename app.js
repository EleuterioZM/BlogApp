// Carregando módulos
const express = require('express');
const { create } = require('express-handlebars'); // Importação correta para versão 8
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path');

// Configurações
// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars
const hbs = create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//Mongoose
 //Em breve
 
 //public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/admin', admin);
// Servidor
app.listen(8081, () => {
    console.log('Servidor rodando na porta 8081!');
});
