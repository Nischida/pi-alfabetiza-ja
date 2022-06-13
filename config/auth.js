const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Model de colaborador
require('../models/Collaborator')
const Collaborator = mongoose.model('collaborators')

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'idrf'}, (idrf, password, done) => {
        Collaborator.findOne({idrf: idrf}).then((collaborator) => {
            if(!collaborator) {
                return done(null, false, {message: 'Esta conta não existe.'})
            }

            bcrypt.compare(password, collaborator.password, (err, match) => {
                if(match) {
                    return done(null, collaborator)
                } else {
                    return done(null, false, {message: 'Senha incorreta.'})
                }
            })
        })
    }))

    passport.serializeUser((collaborator, done) => {
        done(null, collaborator.id)
    })

    passport.deserializeUser((id, done) => {
        Collaborator.findById(id, (err, collaborator) => {
            done(err, collaborator)
        })
    })
}