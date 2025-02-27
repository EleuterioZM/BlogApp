const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

            await usuario.save();
            req.flash('success_msg', 'Usuário criado com sucesso');
            res.redirect('/usuarios/login');
        });
    } catch (err) {
        req.flash('error_msg', 'Erro ao criar usuário: ' + err.message);
        res.redirect('/usuarios/registro');
    }
});

module.exports = router;