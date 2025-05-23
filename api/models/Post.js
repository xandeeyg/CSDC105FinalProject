const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: {type:Schema.Types.ObjectId, ref: 'User'}, //references the User model, linking each post to a specific user
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);
module.exports = PostModel;