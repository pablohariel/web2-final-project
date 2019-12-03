const express = require('express');
const app = express();
const body_parser = require('body-parser');
const session = require('express-session');
const method_override = require('method-override');

app.set('views', './src/views');
app.set('view engine', "ejs");

app.use(session({
    secret: 'XD',
    resave: false,
    saveUninitialized: false
}));

app.use(method_override('_method'));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

const user_routes = require('./src/routes/userRoutes');
app.use(user_routes);

app.use((req, res) => {

    res.redirect('/login');

});

app.listen(3000);