const mongoose = require('mongoose');
const { ObjectID } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type: ObjectID,
        ref: 'User'
    }],
    following: [{
        type: ObjectID,
        ref: 'User'
    }]
})

module.exports = mongoose.model('User', userSchema)
