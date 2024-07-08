const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        enum: ['S','M','L','XL'],
        required: true
    },
    gender: {
        type: String,
        enum: ['M','F'],
        required: true
    },
    category: {
        type: String,
        enum: ["Accessories", "Footwear", "Shirt/T-Shirt", "Tops", "Dresses", "Jackets", "Lowers"],
        required: true
    },
    images: [String],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

const Product = mongoose.model('Product', productSchema)
module.exports = Product