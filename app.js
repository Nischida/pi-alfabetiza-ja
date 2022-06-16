// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const mongoose = require('mongoose')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const passport = require('passport')
    require('./config/auth')(passport)
    const db = require('./config/db')
    const moment = require('moment')
    const moment_tz = require('moment-timezone')

// Configurações
    //Session
        app.use(session({
            secret: 'alfabetiza_ja',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })

    // Body Parser
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())

    // Handlebars
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',
            helpers: {
                ifEquals(arg1, arg2, options) {
                    if(arg1 == arg2) {
                        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                    } else {
                        return (arg1 != arg2) ? options.inverse(this) : options.fn(this);
                    }
                },
                moment(arg1) {
                    moment.locale('pt-br');
                    const date = arg1;
                    const format = "DD/MM/YYYY HH:mm:ss";
                    const timezone = "America/Sao_Paulo";
                    const dateMoment = moment_tz.tz(date, format, timezone);

                    var date_tz = dateMoment.format('DD/MM/YYYY HH:mm:ss')
                    return date_tz;
                }
            }
        }))
        app.set('view engine', 'handlebars')

    // Mongoose
        mongoose.connect(db.mongoURI).then(() => {
            console.log('Conectado ao mongo.')
        }).catch((err) => {
            console.log('Erro ao se conectar: ' + err)
        })

    // Public
        app.use(express.static(path.join(__dirname, 'public')))

// Rotas
    app.get('/', (req, res) => {
        res.render('index')
    })
    app.use('/admin', admin)

// Outros
const PORT = process.env.PORT || 1106
app.listen(PORT, () => {
    console.log('Servidor rodando!')
})