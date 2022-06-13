module.exports = {
    coordinator: function(req, res, next) {
        if(req.isAuthenticated() && req.user.function == 'coordenador') {
            return next()
        }

        req.flash('error_msg', 'Você não tem permissão para acessar esta área.')
        res.redirect('/')
    }
}