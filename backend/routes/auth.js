const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    const check = await User.findOne({email})
    if (check){
        return res.status(400).json({msg: 'User already exists'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    })
    const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
    res.json({ accessToken: accessToken })

})

router.post('/login', async(req,res) => {
    const { email, password } = req.body
    const user = await User.findOne({email})
    if (!user) {
        return res.status(400).json({msg: 'User does not exist'})
    }

    if (await bcrypt.compare(password, user.password)){
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
        res.json({ accessToken: accessToken })
    } else{
        res.status(400).json({msg: 'Invalid credentials'})
    }

})

router.get('/user', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
})

module.exports = router