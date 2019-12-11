const mongoose = require('mongoose');
const User = require('../models/User');

exports.GetSignup = (req, res) => {
    res.render('signup', {
        pageTitle: 'Cadastro',
        loggedIn: req.session.isLoggedIn,
        user: req.session.user
    });
};

exports.PostSignup = (req, res) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    if (req.body.password == req.body.confirmPassword) {
        user.save()
        .then(result => {
              console.log('Usuario cadastrado!');
              res.redirect('/login');
        })
        .catch(error => {
              console.log(error);
              res.redirect('/signup');
        });
    } else {
        console.log('Senhas não batem');
        res.redirect('/signup');
    }
};
