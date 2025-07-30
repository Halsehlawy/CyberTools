const mongoose = require('mongoose')

const toolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true })

const Tool = mongoose.model('Tool', toolSchema)
module.exports = Tool