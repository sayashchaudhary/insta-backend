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

router.put('/follow', authenticated, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
            $push: {
                followers: req.user._id
            }
        }, {
            new: true
        }
    ).then((result, err) => {
        if (!err) {
            User.findByIdAndUpdate(req.user._id, {
                $push: {
                    following: req.body.followId
                }
            }, {
                new: true
            }).then((res) => {
                res.json(res)
            })
        }
        return res.json(result)
    }).catch((error) => {
        return res.status(422).json({ error })
    })
});

router.put('/unfollow', authenticated, (req, res) => {
    User.findByIdAndUpdate(req.body.unFollowId, {
            $pull: {
                followers: req.user._id
            }
        }, {
            new: true
        }
    ).then((result, err) => {
        if (!err) {
            User.findByIdAndUpdate(req.user._id, {
                $pull: {
                    following: req.body.unFollowId
                }
            }, {
                new: true
            }).then((res) => {
                res.json(res)
            })
        }
        return res.json(result)
    }).catch((error) => {
        return res.status(422).json({ error })
    })
});

module.exports = router;
