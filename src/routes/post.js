const express = require('express');
const router = express.Router();
const authenticated = require('../middleware/auth')
const Post = require('../models/post')
const User = require('../models/user')

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

router.get('/allposts', authenticated, (req, res) => {
    Post.find()
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .then((posts) => {
            res.json({ posts })
        }).catch((err) => {
        console.log(err)
    })
})

router.get('/following/posts', authenticated, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .then((posts) => {
            res.json({ posts })
        }).catch((err) => {
        console.log(err)
    })
})

router.get('/profile', authenticated, (req, res) => {
    User.findById({ _id: req.user._id }).select('-password')
        .then((user) => {
            Post.find({ postedBy: req.user._id })
                .populate('postedBy', '_id name')
                .then((posts) => {
                    return res.json({ user, posts })
                })
        })
})

router.put('/like', authenticated, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
});

router.put('/unlike', authenticated, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
});

router.put('/comment', authenticated, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {
            comments: {
                "text": comment.text
            }
        }
    }, {
        new: true
    }).populate('comments', comment.postedBy)
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
});

router.delete('/deletepost/:postId', authenticated, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate('postedBy', '_id')
        .exec((err, post) => {
            if (err || !post) {
                res.status(404).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then((result) => {
                        res.json(result)
                    }).catch((err) => {
                    console.log(err)
                })
            }
        })
})

module.exports = router
