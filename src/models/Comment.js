const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const commentSchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    text: {
        type: String,
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        ref: 'Movie', 
        required: true
    }

})

module.exports = mongoose.model('Comment', commentSchema);