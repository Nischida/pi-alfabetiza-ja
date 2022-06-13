const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Collaborator = new Schema({
    name: {
        type: String,
        required: true
    },
    idrf: {
        type: Number,
        required: true
    },
    function: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

mongoose.model('collaborators', Collaborator)