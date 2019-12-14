const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
    },
    img: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {collection: 'movies'} )

module.exports = mongoose.model('Movie', movieSchema);
