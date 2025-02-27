const bcrypt = require('bcrypt'); // Certifique-se de que está usando bcryptjs
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, senha, done) => {
        Usuario.findOne({ email: email }, (err, usuario) => {
            if (err) { return done(err); }
            if (!usuario) { return done(null, false, { message: 'Usuário não encontrado' }); }
            if (!bcrypt.compareSync(senha, usuario.senha)) { return done(null, false, { message: 'Senha incorreta' }); }
            return done(null, usuario);
        });
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario);
        });
    });
};