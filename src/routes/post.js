const express = require('express');
const router = express.Router();
const authenticated = require('../middleware/auth')
const Post = require('../models/post')

router.post('/createpost', authenticated, (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(442).json({ error: 'Please fill all the fields' })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy: req.user
    })
    post.save().then((result) => {
        res.json({ post: result })
    }).catch((err) => {
        console.log(err)
    })
});

module.exports = router
