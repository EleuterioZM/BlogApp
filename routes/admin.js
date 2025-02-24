const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria");
const Categoria = mongoose.model('categorias');


router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/posts', (req, res) => {
    res.send('Posts');
});
router.get('/categorias', (req, res) => {
    res.render('admin/categorias');
});
router.get('/categorias/create', (req, res) => {
    res.render('admin/categorias/create');
});
router.post('/categorias/save', (req, res) => {
    const newCategoria = new Categoria(req.body);
    newCategoria.save().then(() => {
        res.redirect('/admin/categorias');
    }).catch((err) => {
        res.send('Erro ao salvar categoria: ' + err);
    });
});

module.exports = router;
