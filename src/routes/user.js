const express = require('express');
const router = express.Router();
const authenticated = require('../middleware/auth')
const Post = require('../models/post');
const User = require('../models/user');

router.get('/user/:id', authenticated, (req, res) => {
    User.find({ _id: req.params.id })
        .select('-password')
        .then((user) => {
            Post.find({ postedBy: req.params.id })
                .populate('postedBy', '_id name')
                .then((posts) => {
                    res.json({ user, posts })
                })
            // .populate('postedBy', '_id name')
            // .exec((posts, err) => {
            //     if (err) {
            //         return res.status(422).json({ error: err })
            //     }
            //     console.log(user, posts)
            //     res.json({ user, posts })
            // })
        }).catch((err) => {
        if (err) {
            return res.status(404).json({ error: 'User not found' })
        }
    })
})

// router.get('/user/:id', (req, res) => {
//     User.findById({ _id: req.params.id })
//         .then((user) => {
//             console.log(user)
//             res.json({ user })
//         }).catch((err) => {
//         console.log(err)
//     })
// })

module.exports = router;
