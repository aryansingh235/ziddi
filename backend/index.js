const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const cors = require('cors')
const authroute = require('./routes/auth')
const productsroute = require('./routes/products')
const cartroute = require('./routes/cart')
const bidroute = require('./routes/bid')
const swaproute = require('./routes/swap')
const orderroute = require('./routes/order')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost/ziddi")
.then(()=>console.log("mongodb connected"))
.catch((e)=>console.log(e))

app.use(cors())
app.use('/auth', authroute)
app.use('/products', productsroute)
app.use('/cart', cartroute)
app.use('/bid', bidroute)
app.use('/swap', swaproute)
app.use('/order', orderroute)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})