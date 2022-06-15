const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Classe = new Schema({
    status: {
        type: String,
        default: 'Ativo'
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "collaborators",
        required: true
    },
    phase: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('classes', Classe)