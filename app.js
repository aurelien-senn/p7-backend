const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user')
const app = express();

mongoose.connect('mongodb+srv://admin1:admin1@cluster0.9qidznj.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connexion à mongooDB réussie !'))
    .catch(() => console.log('connexion à mongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;