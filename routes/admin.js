const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria");
require("../models/Postagem");
const Categoria = mongoose.model('categorias');
const Postagem = mongoose.model('postagens');

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

router.get('/postagens', (req, res) => {
    Postagem.find().sort({ date: 'desc' })
        .populate('categoria')// Aqui você usa o populate para carregar os dados da categoria
        .sort({ date: 'desc' })  
        .then((postagens) => {
            res.render('admin/postagens', { postagens: postagens });
        })
        .catch((err) => {
            req.flash('error_msg', 'Erro ao listar postagens: ' + err);
            res.redirect('/admin');
        });
});


router.get('/postagens/create', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/postagens/create', {categorias: categorias});
    });
});

router.post('/postagens/save', (req, res) => {
    var errors = [];

    if (!req.body.titulo) {
        errors.push({ text: 'Título da postagem não pode ser vazio' });
    }
    if (!req.body.slug) {
        errors.push({ text: 'Slug da postagem não pode ser vazio' });
    }
    if (!req.body.descricao) {
        errors.push({ text: 'Descrição da postagem não pode ser vazia' });
    }
    if (!req.body.conteudo) {
        errors.push({ text: 'Conteúdo da postagem não pode ser vazio' });
    }
    if (!req.body.categoria) {
        errors.push({ text: 'Categoria da postagem não pode ser vazia' });
    }
    
    if (errors.length > 0) {
        return res.render('admin/postagens/create', { errors: errors });
    }

    const newPostagem = new Postagem(req.body);
    newPostagem.save()
        .then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso ✅');
            return res.redirect('/admin/postagens');
        })
        .catch((err) => {
            req.flash('error_msg', 'Erro ao salvar postagem: ' + err);
            return res.redirect('/admin/postagens/create');
        });
}); 

router.get('/postagens/edit/:id', (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
            res.render('admin/postagens/edit', {postagem: postagem, categorias: categorias});
        });
    });
});

router.post('/postagens/update', async (req, res) => {    
    try {
        const postagem = await Postagem.findOne({ _id: req.body.id });

        if (!postagem) {
            req.flash('error_msg', 'Postagem não encontrada.');
            return res.redirect('/admin/postagens');
        }

        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.categoria = req.body.categoria;

        await postagem.save(); // Aguarda a atualização da postagem

        req.flash('success_msg', 'Postagem atualizada com sucesso ✅');
        return res.redirect('/admin/postagens');
    } catch (err) {
        req.flash('error_msg', 'Erro ao atualizar postagem: ' + err);
        return res.redirect('/admin/postagens');
    }
});


router.post('/postagens/delete/:id', (req, res) => {
    Postagem.findByIdAndDelete(req.params.id)
        .then(() => {
            req.flash('success_msg', 'Postagem deletada com sucesso ✅');
            return res.redirect('/admin/postagens');
        })
        .catch((err) => {
            req.flash('error_msg', 'Erro ao deletar postagem: ' + err);
            return res.redirect('/admin/postagens');
        });
});




module.exports = router;
