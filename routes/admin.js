const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Collaborator')
const Collaborator =  mongoose.model('collaborators')
require('../models/Classe')
const Classe =  mongoose.model('classes')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {coordinator} = require('../helpers/coordinator')
const {teacher} = require('../helpers/teacher')
const res = require('express/lib/response')
const { get } = require('express/lib/response')

router.get('/', teacher, (req, res) => {
    res.render('admin/index')
})

// Collaborators
router.get('/collaborators', teacher, (req, res) => {
    Collaborator.find().lean().sort({date: 'desc'}).then((collaborators) => {
        res.render('admin/collaborators', {collaborators: collaborators})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os colaboradores')
        res.redirect('/admin')
    })
})

router.get('/collaborators/add', coordinator, (req, res) => {
    res.render('admin/addcollaborators')
})

router.post('/collaborators/add', coordinator, (req, res) => {
    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({
            text: 'Nome inválido.'
        })
    }

    if(!req.body.idrf || typeof req.body.idrf == undefined || req.body.idrf == null) {
        erros.push({
            text: 'IDRF inválido.'
        })
    } else if(req.body.idrf.length < 7) {
        erros.push({
            text: 'IDRF muito curto.'
        })
    } else if(req.body.idrf.length > 7) {
        erros.push({
            text: 'IDRF muito longo.'
        })
    }

    if(!req.body.function || typeof req.body.function == undefined || req.body.function == null) {
        erros.push({
            text: 'Função não especificada.'
        })
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({
            text: 'E-mail inválido.'
        })
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        erros.push({
            text: 'Senha inválida.'
        })
    }

    if(req.body.password.length < 4) {
        erros.push({
            text: 'Senha muito curta.'
        })
    }

    if(req.body.password != req.body.password2) {
        erros.push({
            text: 'As senhas são diferentes, tente novamente.'
        })
    }

    if(erros.length > 0) {
        res.render('admin/addcollaborators', {
            erros: erros
        })
    } else {
        Collaborator.findOne({idrf: req.body.idrf}).then((collaborator) => {
            if(collaborator) {
                req.flash('error_msg', 'Já existe um colaborador com esse RF em nosso sistema.')
                res.redirect('/admin/collaborators')
            } else {
                const newCollaborator = new Collaborator({
                    name: req.body.name,
                    idrf: req.body.idrf,
                    function: req.body.function,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newCollaborator.password, salt, (err, hash) => {
                        if(err) {
                            req.flash('error_msg', 'Houve um erro durante a criação do colaborador: ' + err)
                            res.redirect('/admin/collaborators')
                        }

                        newCollaborator.password = hash

                        newCollaborator.save().then(() => {
                            req.flash('success_msg', 'Colaborador criado com sucesso!')
                            res.redirect('/admin/collaborators')
                        }).catch((err) => {
                            req.flash('error_msg', 'Houve um erro ao criar o colaborador, tente novamente!')
                            res.redirect('/admin')
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno: ' + err)
            res.redirect('/admin')
        })
    }
})

router.get('/collaborators/edit/:id', coordinator, (req, res) => {
    Collaborator.findOne({_id: req.params.id}).lean().then((collaborator) => {
        res.render('admin/editcollaborators', {collaborator: collaborator})
    }).catch((err) => {
        req.flash('error_msg', 'Este colaborador não existe')
        res.redirect('/admin/collaborators')
    })
    
})

router.post('/collaborators/edit', coordinator, (req, res) => {
    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({
            text: 'Nome inválido.'
        })
    }

    if(!req.body.idrf || typeof req.body.idrf == undefined || req.body.idrf == null) {
        erros.push({
            text: 'IDRF inválido.'
        })
    } else if(req.body.idrf.length < 7) {
        erros.push({
            text: 'IDRF muito curto.'
        })
    } else if(req.body.idrf.length > 7) {
        erros.push({
            text: 'IDRF muito longo.'
        })
    }

    if(!req.body.function || typeof req.body.function == undefined || req.body.function == null) {
        erros.push({
            text: 'Função não especificada.'
        })
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({
            text: 'E-mail inválido.'
        })
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        erros.push({
            text: 'Senha inválida.'
        })
    }

    if(req.body.password.length < 4) {
        erros.push({
            text: 'Senha muito curta.'
        })
    }

    if(req.body.password != req.body.password2) {
        erros.push({
            text: 'As senhas são diferentes, tente novamente.'
        })
    }

    if(erros.length > 0) {
        res.render('admin/editcollaborators', {
            erros: erros
        })
    } else {
        Collaborator.findOne({_id: req.body.id}).then((collaborator) => {
            collaborator.name = req.body.name
            collaborator.idrf = req.body.idrf
            collaborator.function = req.body.function
            collaborator.email = req.body.email
            collaborator.password = req.body.password
            collaborator.lastModifiedDate = Date.now()

            collaborator.save().then(() => {
                req.flash('success_msg', 'Colaborador editado com sucesso!')
                res.redirect('/admin/collaborators')
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro interno ao salvar a edição do colaborador: ' + err)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao editar a categoria')
            res.redirect('/admin/collaborators')
        })
    }
})

router.post('/collaborators/delete', coordinator, (req, res) => {
    Collaborator.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Colaborador deletado com sucesso!')
        res.redirect('/admin/collaborators')
    }).catch((err) => {
        req.flash('error_msg', 'Houver um erro ao deletar o colaborador: ' + err)
        res.redirect('/admin/collaborators')
    })
})

// Login
router.get('/collaborators/login', (req, res) => {
    res.render('admin/login')
})

router.post('/collaborators/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/admin/collaborators/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/collaborators/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'Deslogado com sucesso.')
        res.redirect('/')
      });
})

// Classes
router.get('/classes', (req, res) => {
    Classe.find().lean().populate('teacher').sort({date: 'desc'}).then((classes) => {
        res.render('admin/classes', {classes: classes})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os colaboradores')
        res.redirect('/admin')
    })
})

router.get('/classes/add', (req, res) => {
    Collaborator.find({function: 'professor'}).lean().then((collaborator) => {
        res.render('admin/addclasses', {collaborators: collaborator})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar os professores: ' + err)
        res.redirect('/admin/classes')
    })
})

router.post('/classes/add', (req, res) => {
    var erros = []

    if(req.body.teacher == 0) {
        erros.push({
            text: 'Professor inválido, registre um professor.'
        })
    }

    if(erros.length > 0) {
        res.render('admin/addclasses', {erros: erros})
    } else {
        const newClasse = {
            teacher: req.body.teacher,
            phase: req.body.phase
        }

        new Classe(newClasse).save().then(() => {
            req.flash('success_msg', 'Turma criada com sucesso!')
            res.redirect('/admin/classes')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro durante a criação da turma: ' + err)
            res.redirect('/admin/classes')
        })
    }
})

router.get('/classes/edit/:id/:pfid', (req, res) => {
    Classe.findOne({_id: req.params.id}).lean().then((classe) => {
        Collaborator.find({function: 'professor'}).lean().then((collaborators) => {
            res.render('admin/editclasses', {collaborators: collaborators, classe: classe})    
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar os colaboradores: ' + err)
            res.redirect('/admin/classes')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição: ' + err)
        res.redirect('/admin/classes')
    })
})

router.post('/classes/edit', (req, res) => {
    Classe.findOne({_id: req.body.id}).then((classe) => {
        classe.status = (req.body.status) ? 'Ativo' : 'Inativo';
        classe.teacher = req.body.teacher
        classe.phase = req.body.phase

        classe.save().then(() => {
            req.flash('success_msg', 'Turma editada com sucesso!')
            res.redirect('/admin/classes')
        }).catch((err) => {
            req.flash('error_msg', 'Erro interno: ' + err)
            res.redirect('/admin/classes')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a edição: ' + err)
        res.redirect('/admin/classes')
    })
})

router.post('/classes/delete', (req, res) => {
    Classe.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Turma deletada com sucesso!')
        res.redirect('/admin/classes')
    }).catch((err) => {
        req.flash('error_msg', 'Houver um erro ao deletar a turma: ' + err)
        res.redirect('/admin/classes')
    })
})

// Students
router.get('/students', (req, res) => {
    res.send('Página de cadastro de estudantes')
})

module.exports = router