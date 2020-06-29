const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/keys');

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: 'Please fill the fields' })
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(400).json({ message: 'User already exist' })
        }
        bcrypt.hash(password, 10).then((hashedPassword) => {
            const user = new User({
                name,
                email,
                password: hashedPassword
            });
            user.save().then(user => {
                res.json({ message: 'Register successfully' })
            }).catch(err => {
                console.log(err)
            })
        })
    }).catch(err => {
        console.log(err)
    })
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({ error: 'Please provide email and password' })
    }
    User.findOne({ email: email }).then(savedUser => {
        if (!savedUser) {
            return res.status(404).json({ error: 'Invalid email or password' })
        }
        bcrypt.compare(password, savedUser.password)
            .then(doMatch => {
                if (doMatch) {
                    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                    const { _id, name, email } = savedUser
                    res.json({ token, user: { _id, name, email } })
                }
                return res.status(400).json({ error: 'Invalid email or password' })
            })
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router
