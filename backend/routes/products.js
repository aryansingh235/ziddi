const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Product = require('../models/product')
const User = require('../models/user')
const Offer = require('../models/offer')
// const multer = require('multer')
// const path = require('path')


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
//   })
  
// const upload = multer({ storage: storage })

router.get('/', async (req,res) => {
    try {
        let filter = {}
        const products = await Product.find(filter).populate('seller')
        res.json(products)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})
// upload.array('image', 5)
router.post('/', auth, async (req,res) => {
    const { name, description, price, size, gender, category, images } = req.body
    const seller = req.user.id
    // const images = req.files.map(file => `/uploads/${file.filename}`)
    const newProduct = await Product.create({
        name,
        description,
        price,
        size,
        gender,
        category,
        images,
        seller
    })
    const updateInventory = await User.findByIdAndUpdate(seller,
        {$push: {"inventory": newProduct}}
    )
    res.json(newProduct)
})

router.delete('/:id', auth, async (req, res) => {
    const seller = req.user.id
    const del = await Product.findByIdAndDelete(req.params.id)
    const pop = await User.findByIdAndUpdate(seller, 
        {$pull: {"inventory": req.params.id}}
    )
    res.json({msg:"deleted successfully"})
})

module.exports = router