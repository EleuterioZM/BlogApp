//carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
//const mongoose = require('mongoose');

//configurações
//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//mongoose


//rotas


//outros
app.listen(8081, () => {
    console.log('Servidor rodando!');
});
