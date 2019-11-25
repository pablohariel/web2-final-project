const mongoose = require('../config/database');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profile_image: {
        type: String
    },
    watched_films: {
        Type: [String]
    },
    liked_films: {
        Type: [String]
    },
    watch_list: {
        Type: [String]
    },
    films_reviews: {
        type: [String]
    }   
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;