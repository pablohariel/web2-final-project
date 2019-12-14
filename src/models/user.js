const mongoose = require('mongoose');
const Movie = require('./Movie');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    required: true
  },
  profile_image: {
    type: String
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  watched_list: [{
    // Type: mongoose.Schema.Types.ObjectId,
    // ref: 'Movie'
  }],
  watch_list: [{
  //   Type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Movie',
  }],

  //temporary
  watchedMovies: [],
  watchlist: [],
  
  isadmin: {
    type: Boolean,
    default: false
  }
}, {collection: 'users'});

module.exports = mongoose.model("User", userSchema);
