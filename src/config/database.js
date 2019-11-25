const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/web_2_project';

mongoose.connect(uri);

module.exports = mongoose;