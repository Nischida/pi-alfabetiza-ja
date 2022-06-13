module.exports = {
    teacher: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        }

        req.flash('error_msg', 'Você não tem permissão para acessar esta área.')
        res.redirect('/')
    }
}