const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
})
module.exports = mongoose.model('comment', CommentSchema);