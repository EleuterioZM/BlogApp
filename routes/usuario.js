const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const eAdmin = require('../helpers/eAdmin');
const saltRounds = 10;

// Rota de registro (GET)
router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
});

// Rota de registro (POST)
router.post('/registro', async (req, res) => {
    const { nome, email, senha, senha2 } = req.body;
    const errors = [];

    // Validações
    if (!nome || !email || !senha || !senha2) {
        errors.push({ texto: 'Todos os campos são obrigatórios' });
    }
    if (nome.length < 3) {
        errors.push({ texto: 'O nome deve ter mais de 3 caracteres' });
    }
    if (senha !== senha2) {
        errors.push({ texto: 'As senhas não conferem' });
    }
    if (senha.length < 4) {
        errors.push({ texto: 'A senha deve ter mais de 4 caracteres' });
    }

    if (errors.length > 0) {
        return res.render('usuarios/registro', { errors });
    }

    try {
        // Verifica se o e-mail já está registrado
        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
            errors.push({ texto: 'Este e-mail já está registrado' });
            return res.render('usuarios/registro', { errors });
        }

        // Criptografa a senha
        bcrypt.hash(senha, saltRounds, async (err, hash) => {
            if (err) {
                req.flash('error_msg', 'Erro ao criptografar a senha');
                return res.redirect('/usuarios/registro');
            }

            // Cria o usuário com a senha criptografada
            const usuario = new Usuario({ nome, email, senha: hash });
         //   usuario.eAdmin = 1;
            await usuario.save();
            req.flash('success_msg', 'Usuário criado com sucesso');
            res.redirect('/usuarios/login');
        });
    } catch (err) {
        req.flash('error_msg', 'Erro ao criar usuário: ' + err.message);
        res.redirect('/usuarios/registro');
    }
});

// Rota de login (GET)
router.get('/login', (req, res) => {
    res.render('usuarios/login');
});

// Rota de login (POST)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const errors = [];

    if (!email || !senha) {
        errors.push({ texto: 'Todos os campos são obrigatórios' });
        return res.render('usuarios/login', { errors });
    }

    try {
        // Verifica se o e-mail está registrado
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            errors.push({ texto: 'E-mail não encontrado' });
            return res.render('usuarios/login', { errors });
        }

        // Verifica se a senha está correta
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            errors.push({ texto: 'Senha incorreta' });
            return res.render('usuarios/login', { errors });
        }

        // Autentica o usuário
        req.session.usuario = usuario;
        req.flash('success_msg', 'Login realizado com sucesso');
        res.redirect('/');
    } catch (err) {
        req.flash('error_msg', 'Erro ao fazer login: ' + err.message);
        res.redirect('/usuarios/login');
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Deslogado com sucesso');
    res.redirect('/');
});


module.exports = router;