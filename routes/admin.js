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
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        res.render('admin/categorias', {categorias: categorias});
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar categorias: ' + err);
        res.redirect('/admin');
    });
});
router.get('/categorias/create', (req, res) => {
    res.render('admin/categorias/create');
});
router.post('/categorias/save', (req, res) => {
    var errors = [];

    if (!req.body.nome) {
        errors.push({ text: 'Nome da categoria não pode ser vazio' });
    }
    if (!req.body.slug) {
        errors.push({ text: 'Slug da categoria não pode ser vazio' });
    }
    if (req.body.nome.length < 2) {
        errors.push({ text: 'Nome da categoria deve ter mais de 2 caracteres' });
    }

    if (errors.length > 0) {
        return res.render('admin/categorias/create', { errors: errors }); 
    }

    const newCategoria = new Categoria(req.body);
    newCategoria.save()
        .then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso ✅');
            return res.redirect('/admin/categorias'); 
        })
        .catch((err) => {
            req.flash('error_msg', 'Erro ao salvar categoria: ' + err);
            return res.send('Erro ao salvar categoria: ' + err); 
        });
});
router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        return res.render('admin/categorias/edit', {categoria: categoria});
       
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao editar categoria: ' + err);
        res.redirect('/admin/categorias');
    });
});
router.post('/categorias/update', async (req, res) => {
    try {
        const categoria = await Categoria.findOne({ _id: req.body.id });

        if (!categoria) {
            req.flash('error_msg', 'Categoria não encontrada.');
            return res.redirect('/admin/categorias');
        }

        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        await categoria.save(); // Espera a atualização

        req.flash('success_msg', 'Categoria atualizada com sucesso ✅');
        return res.redirect('/admin/categorias');
    } catch (err) {
        req.flash('error_msg', 'Erro ao atualizar categoria: ' + err);
        return res.redirect('/admin/categorias');
    }
});
router.post('/categorias/delete/:id', (req, res) => {
    Categoria.findByIdAndDelete(req.params.id)
        .then(() => {
            req.flash('success_msg', 'Categoria deletada com sucesso ✅');
            return res.redirect('/admin/categorias');
        })
        .catch((err) => {
            req.flash('error_msg', 'Erro ao deletar categoria: ' + err);
            return res.redirect('/admin/categorias');
        });
});


module.exports = router;
