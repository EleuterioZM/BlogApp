module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash('error_msg', 'Você precisa ser um admin para acessar esta página');
        res.redirect('/');
    }
}