const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'oh peach pit whered the hours go',
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

const adminRoutes = require('./src/routes/adminRoutes');
app.use('/admin', adminRoutes);
const userRoutes = require('./src/routes/userRoutes');
app.use(userRoutes);

app.use((req, res) => {
  res.status(404);
  res.send('PAGE NOT FOUND');
  res.end();
});

mongoose.connect('mongodb://localhost:27017/web_2_project').then(result => {
  app.listen(3000, () => console.log('Listening at 3000'));
});
