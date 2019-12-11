const mongoose = require("mongoose");

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
  watched_movies: {
    Type: [String]
  },
  liked_movies: {
    Type: [String]
  },
  watch_list: {
    Type: [String]
  },
  isadmin: {
    type: Boolean,
    default: false
  }
}, {collection: 'users'});

module.exports = mongoose.model("User", userSchema);
