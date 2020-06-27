const mongoose = require('mongoose');
const { ObjectID } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        // required: true
    },
    postedBy: {
        type: ObjectID,
        ref: 'User'
    }
})

module.exports = mongoose.model('Post', postSchema)
