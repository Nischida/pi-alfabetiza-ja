const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Student = new Schema({
    name: {
        type: String,
        required: true
    },
    ideol: {
        type: Number,
        required: true
    },
    serie: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phase: {
        type: Schema.Types.ObjectId,
        ref: "classes",
        required: true
    },
    classe: {
        type: Schema.Types.ObjectId,
        ref: "collaborators",
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

mongoose.model('students', Student)