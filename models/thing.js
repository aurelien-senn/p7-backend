const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    userId: { type: String, required: true },
    likes: { type: Number, default: 0, required: true },
    usersLiked: { type: Array, default: [], required: true },
    dislikes: { type: Number, default: 0, required: true },
    usersDisliked: { type: Array, default: [], required: true },
});

module.exports = mongoose.model('Thing', thingSchema);