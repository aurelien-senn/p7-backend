const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    imageUrl: { type: String, required: true, default: "http://localhost:3000/images/image.png" },
    admin: { type: Boolean, required: true, default: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);