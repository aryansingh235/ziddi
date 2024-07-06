const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')
const Offer = require('../models/offer')
const Order = require('../models/order')

router.post('/checkout/:id', auth, async (req, res) => {
    const buyerId = req.user.id 
    const productId = req.params.id 
    const product = await Product.findById(productId)
    const sellerId = product.seller

    const cartarr = await User.findById(buyerId).select({ "cart": 1, "_id": 0 })

    const newOrder = await Order.create({
        buyer: buyerId,
        seller: sellerId,
        product: productId,
        totalAmount: product.price
    })
    res.json(newOrder)

    if (cartarr.cart.includes(productId)) {
        const popcart = await User.findByIdAndUpdate(buyerId,
            {$pull: {"cart": productId}}
        )
    }

    const popinventory = await User.findByIdAndUpdate(sellerId,
        {$pull: {"inventory": productId}}
    )

    const prodseller = await Product.findByIdAndUpdate(productId, {
        buyer: buyerId
    })

})

router.get('/', auth, async (req, res) => {
    const buyer = req.user.id
    const orders = await Order.find({buyer}).sort({createdAt:-1}).populate([{path:'buyer'}, {path:'seller', select:'name email inventory'}, {path:'product'}])
    res.json(orders)
})


module.exports = router