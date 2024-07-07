const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    inventory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
module.exports = User