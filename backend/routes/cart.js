const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')

router.post('/:id', auth, async (req, res) => {
    const userId = req.user.id
    const productId = req.params.id
    const cartarr = await User.findById(userId).select({ "cart": 1, "_id": 0 })

    if (!cartarr.cart.includes(productId)){
        const addtocart = await User.findByIdAndUpdate(userId, { $push: { "cart": productId } })
        res.json({msg:'added to cart'})
    } else {
        res.json({msg:"item already in cart"})
    }

})

router.get('/', auth, async (req, res) => {
    const userId = req.user.id
    const cart = await User.findById(userId).select({ "cart": 1, "_id": 0 }).populate("cart")

    if(cart.cart.length>0){
        res.send(cart)
    } else {
        res.send(null)
    }
})

router.delete('/:id', auth, async (req, res) => {
    const userId = req.user.id
    const productId = req.params.id

    const pop = await User.findByIdAndUpdate(userId,
        {$pull: {"cart": productId}}
    )
    res.json({msg:"item removed from cart"})
})

module.exports = router