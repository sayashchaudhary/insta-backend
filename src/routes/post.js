const express = require('express');
const router = express.Router();
const authenticated = require('../middleware/auth')
const Post = require('../models/post')

router.post('/createpost', authenticated, (req, res) => {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) {
        return res.status(442).json({ error: 'Please fill all the fields' })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    })
    post.save().then((result) => {
        res.json({ post: result })
    }).catch((err) => {
        console.log(err)
    })
});

// router.get('/allposts', authenticated, (req, res) => {
//     Post.find().populate('postedBy', '_id name')
//         .then((posts) => {
//             res.json({ posts })
//         }).catch((err) => {
//         console.log(err)
//     })
// })

router.get('/myposts', authenticated, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate('postedBy', '_id name')
        .then((posts) => {
            res.json({ posts })
        }).catch((err) => {
        console.log(err)
    })
})

module.exports = router
