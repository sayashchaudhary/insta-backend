const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/keys');

//My routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('DB connected')
});

//My routes
app.use(express.json());
app.use(authRoutes);
app.use(postRoutes);

const Port = 3000;

app.listen(Port, () => {
    console.log(`Server is running on ${Port}`)
})



